import pickle
import os
import time
from zipfile import ZipFile, ZIP_BZIP2
from threading import Thread, Lock

from . import snapper
from . import sessions
from . import finder
from . import faker
from .file_watcher import FileWatcher

SAVE_FILE = 'stellaru.pickle'
WAITING_MESSAGE = {'status': 'WAITING'}
LOADING_MESSAGE = {'status': 'LOADING'}

monitored_saves = {}
save_lock = Lock()


def insert_snap(snaps, snap):
    for i in range(0, len(snaps)):
        oldsnap = snaps[i]
        if oldsnap['date_days'] < snap['date_days']:
            continue
        if snap['date_days'] == oldsnap['date_days']:
            return False
        snaps.insert(i, snap)
        return True
    snaps.append(snap)     
    return True


def _load_save(watcher, session_id):
    data_file = watcher.get_data_file()
    snaps = []
    try:
        with ZipFile(data_file, 'r') as zip:
            with zip.open(SAVE_FILE, 'r') as f:
                snaps = pickle.loads(f.read())
    except:
        snaps = []
    snap = snapper.build_snapshot_from_watcher(watcher)
    insert_snap(snaps, snap)
    return {
        'watcher': watcher,
        'sessions': [session_id],
        'snaps': snaps,
        'updater': Thread(target=_watch_save, args=[watcher])
    }


def load_and_add_save(watcher, session_id):
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


def append_save(watcher, snapshot):
    global monitored_saves
    folder = watcher.name()
    if folder in monitored_saves:
        save_lock.acquire()
        insert_snap(monitored_saves[folder]['snaps'], snapshot)
        _flush_save(monitored_saves[folder])
        save_lock.release()
        return True
    return False


def add_save_watcher(watcher, session_id):
    global monitored_saves
    folder = watcher.name()
    if folder in monitored_saves:
        save_lock.acquire()
        monitored_saves[folder]['sessions'].append(session_id)
        save_lock.release()


def session_reconnected(session_id, file):
    save_watcher = finder.get_save(file)
    if save_watcher:
        load_and_add_save(save_watcher, session_id)


def get_save(watcher, session_id, load=False):
    if watcher.name() in monitored_saves:
        return monitored_saves[watcher.name()]
    if load:
        return load_and_add_save(watcher, session_id)
    return None


def save_active(save_name):
    return save_name in monitored_saves


def _flush_save(save):
    data_file = save['watcher'].get_data_file()
    with ZipFile(data_file, 'w', ZIP_BZIP2) as zip:
        with zip.open(SAVE_FILE, 'w') as f:
            f.write(pickle.dumps(save['snaps']))


def _send_to_sessions(save, payload):
    for session in save['sessions']:
        sessions.notify_session(session, payload)


def _debug_watcher_update(save):
    _send_to_sessions(save, LOADING_MESSAGE)
    time.sleep(5)
    last_snap = save['snaps'][-1]
    fake = faker.fake_snap(last_snap)
    append_save(save['watcher'], fake)
    _send_to_sessions(save, fake)


def _watcher_update(save):
    save['watcher'].refresh()
    if save['watcher'].new_data_available():
        _send_to_sessions(save, LOADING_MESSAGE)
        snap = snapper.build_snapshot_from_watcher(save['watcher'])
        append_save(save['watcher'], snap)
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
            if not save['sessions']:
                print(f'Save expired: {watcher.name()}')
                save_lock.acquire()
                #monitored_saves.pop(watcher.name())
                save_lock.release()
                break

            # Refresh
            _watcher_update(save)

            _send_to_sessions(save, WAITING_MESSAGE)
            time.sleep(1)
        except:
            pass
