import pickle
import os
import time
from zipfile import ZipFile, ZIP_BZIP2
from threading import Thread, Lock

from . import snapper
from . import sessions
from . import faker

ZIP_FILE = 'stellaru.zip'
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
    folder = os.path.dirname(watcher.get_file())
    snaps = []
    try:
        with ZipFile(os.path.join(folder, ZIP_FILE), 'r') as zip:
            with zip.open(SAVE_FILE, 'r') as f:
                snaps = pickle.loads(f.read())
    except:
        snaps = []
    snap = snapper.build_snapshot_from_watcher(watcher)
    insert_snap(snaps, snap)
    return {
        'directory': folder,
        'watcher': watcher,
        'sessions': [session_id],
        'snaps': snaps,
        'updater': Thread(target=_watch_save, args=[watcher])
    }


def load_and_add_save(watcher, session_id):
    global monitored_saves
    folder = os.path.dirname(watcher.get_file())
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
    folder = os.path.dirname(watcher.get_file())
    if folder in monitored_saves:
        save_lock.acquire()
        insert_snap(monitored_saves[folder]['snaps'], snapshot)
        _flush_save(monitored_saves[folder])
        save_lock.release()
        return True
    return False


def add_save_watcher(watcher, session_id):
    global monitored_saves
    folder = os.path.dirname(watcher.get_file())
    if folder in monitored_saves:
        save_lock.acquire()
        monitored_saves[folder]['sessions'].append(session_id)
        save_lock.release()


def get_save(folder):
    if folder in monitored_saves:
        return monitored_saves[folder]
    return None


def _flush_save(save):
    folder = save['directory']
    with ZipFile(os.path.join(folder, ZIP_FILE), 'w', ZIP_BZIP2) as zip:
        with zip.open(SAVE_FILE, 'w') as f:
            f.write(pickle.dumps(save['snaps']))


def _send_to_sessions(save, payload):
    for session in save['sessions']:
        sessions.notify_session(session, payload)


def _debug_watcher_update(save, folder, watcher):
    _send_to_sessions(save, LOADING_MESSAGE)
    time.sleep(5)
    last_snap = save['snaps'][-1]
    fake = faker.fake_snap(last_snap)
    append_save(watcher, fake)
    _send_to_sessions(save, fake)


def _watcher_update(save, folder, watcher):
    save['watcher'].refresh()
    if save['watcher'].new_data_available():
        _send_to_sessions(save, LOADING_MESSAGE)
        snap = snapper.build_snapshot_from_watcher(save['watcher'])
        append_save(watcher, snap)
        _send_to_sessions(save, snap)


def _watch_save(watcher):
    global monitored_saves
    folder = os.path.dirname(watcher.get_file())

    while True:
        try:
            # Check deleted
            if folder not in monitored_saves:
                break
            save = monitored_saves[folder]

            # Check sessions expired
            save['sessions'] = [
                session for session in save['sessions']
                if not sessions.session_expired(session)
            ]
            if not save['sessions']:
                print(f'Save expired: {watcher.get_file()}')
                save_lock.acquire()
                #monitored_saves.pop(folder)
                save_lock.release()
                break

            # Refresh
            _watcher_update(save, folder, watcher)

            _send_to_sessions(save, WAITING_MESSAGE)
            time.sleep(1)
        except:
            pass
