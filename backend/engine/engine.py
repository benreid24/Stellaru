import pickle
import os
import time
import traceback
from zipfile import ZipFile, ZIP_BZIP2
from threading import Thread, Lock

from engine import extractor
from engine import sessions
from engine import finder
from engine.util import fake_snap

SAVE_FILE = 'stellaru.pickle'
WAITING_MESSAGE = {'status': 'WAITING'}
LOADING_MESSAGE = {'status': 'LOADING'}

monitored_saves = {}
save_lock = Lock()


def _make_connect_status_message(session_id, empire_id, connected):
    return {
        'session_event': {
            'session_id': session_id,
            'empire_id': empire_id,
            'status': 'CONNECTED' if connected else 'DISCONNECTED'
        }
    }


def _notify_connect_event(watcher, session_id, connected):
    if watcher.name() in monitored_saves:
        save = monitored_saves[watcher.name()]
        session = sessions.get_session(session_id)
        empire = session['empire'] if session else 0
        _send_to_sessions(save, _make_connect_status_message(session_id, empire, connected))


def add_save(watcher, session_id):
    global monitored_saves
    folder = watcher.name()
    if folder not in monitored_saves:
        save_lock.acquire()
        monitored_saves[folder] = _load_save(watcher, session_id)
        save_lock.release()
        monitored_saves[folder]['updater'].start()
    else:
        add_save_watcher(watcher, session_id)
    return monitored_saves[folder]


def add_save_watcher(watcher, session_id):
    global monitored_saves
    folder = watcher.name()
    if folder in monitored_saves:
        if session_id not in monitored_saves[folder]['sessions']:
            save_lock.acquire()
            monitored_saves[folder]['sessions'].append(session_id)
            save_lock.release()


def session_reconnected(session_id, file):
    save_watcher = finder.get_save(file)
    if save_watcher:
        _notify_connect_event(save_watcher, session_id, True)
        add_save(save_watcher, session_id)


def session_disconnected(session_id, file):
    save_watcher = finder.get_save(file)
    if save_watcher:
        print('Send session disconnect')
        _notify_connect_event(save_watcher, session_id, False)


def get_sessions(file):
    save_watcher = finder.get_save(file)
    if save_watcher and save_watcher.name() in monitored_saves:
        sids = monitored_saves[save_watcher.name()]['sessions']
        session_list = []
        for sid in sids:
            session = sessions.get_session(sid)
            if session and isinstance(session['empire'], int):
                session_list.append({
                    'session_id': sid,
                    'empire_id': session['empire'] 
                })
        return session_list
    return []


def get_save(watcher, session_id, load=False):
    if watcher.name() in monitored_saves:
        return monitored_saves[watcher.name()]
    if load:
        return add_save(watcher, session_id)
    return None


def save_active(save_name):
    return save_name in monitored_saves


def _load_save(watcher, session_id):
    data_file = watcher.get_data_file()
    snaps = []
    try:
        with ZipFile(data_file, 'r') as zip:
            with zip.open(SAVE_FILE, 'r') as f:
                snaps = pickle.loads(f.read())
    except:
        snaps = []
    snap = extractor.build_snapshot(watcher)
    _insert_snapshot(snaps, snap)
    return {
        'watcher': watcher,
        'sessions': [session_id],
        'snaps': snaps,
        'updater': Thread(target=_watch_save, args=[watcher])
    }


def _add_snapshot(watcher, snapshot):
    global monitored_saves
    folder = watcher.name()
    if folder in monitored_saves:
        _insert_snapshot(monitored_saves[folder]['snaps'], snapshot)
        _flush_save(monitored_saves[folder])
        return True
    return False


def _insert_snapshot(snaps, snap):
    for i in range(0, len(snaps)):
        oldsnap = snaps[i]
        if oldsnap['date_days'] < snap['date_days']:
            continue
        snaps = snaps[:i+1]
        break
    snaps.append(snap)


def _flush_save(save):
    data_file = save['watcher'].get_data_file()
    with ZipFile(data_file, 'w', ZIP_BZIP2) as zip:
        with zip.open(SAVE_FILE, 'w') as f:
            f.write(pickle.dumps(save['snaps']))


def _send_to_sessions(save, payload):
    for session in save['sessions']:
        sessions.notify_session(session, payload)


def _debug_watcher_update(save):
    print('Faking')
    _send_to_sessions(save, LOADING_MESSAGE)
    time.sleep(5)
    last_snap = save['snaps'][-1]
    fake = fake_snap(last_snap)
    print('Faked')
    _add_snapshot(save['watcher'], fake)
    _send_to_sessions(save, fake)


def _watcher_update(save):
    save['watcher'].refresh()
    if save['watcher'].new_data_available():
        _send_to_sessions(save, LOADING_MESSAGE)
        snap = extractor.build_snapshot(save['watcher'], save['snaps'])
        _add_snapshot(save['watcher'], snap)
        _send_to_sessions(save, snap)


def _watch_save(watcher):
    global monitored_saves

    while True:
        try:
            # Check deleted
            if watcher.name() not in monitored_saves:
                break
            save = monitored_saves[watcher.name()]

            # Check sessions expired
            save['sessions'] = [
                session for session in save['sessions']
                if not sessions.session_expired(session)
            ]

            # If all sessions expired wait a few seconds then die
            if not sessions.sessions_left():
                print('No sessions left')
                time.sleep(20)
                if not sessions.sessions_left():
                    print('Exiting')
                    os._exit(0)

            # Refresh
            save_lock.acquire()
            _watcher_update(save)

            _send_to_sessions(save, WAITING_MESSAGE)
            time.sleep(1)
        except:
            traceback.print_exc()
        finally:
            save_lock.release()
