import json
import os
import time
from threading import Thread, Lock

from . import snapper
from . import sessions

SAVE_FILE = 'stellaru.json'

session_saves = {}
monitored_saves = {}
save_lock = Lock()


def _load_save(watcher, session_id):
    folder = os.path.dirname(watcher.get_file())
    snaps = []
    if os.path.isfile(os.path.join(folder, SAVE_FILE)):
        with open(os.path.join(folder, SAVE_FILE), 'r') as f:
            try:
                snaps = json.loads(f.read())
            except:
                snaps = []
    snap = snapper.build_snapshot_from_watcher(watcher)
    if not snaps or snaps[-1]['date'] != snap['date']: # TODO - verify time only forward
        snaps.append(snap)
    return {
        'directory': folder,
        'watcher': watcher,
        'sessions': [session_id],
        'snaps': snaps,
        'updater': Thread(target=_watch_save, args=[watcher])
    }


def get_save_watcher(save_file):
    folder = os.path.dirname(save_file)
    if folder in monitored_saves:
        return monitored_saves[folder]['watcher']
    return None


def load_and_add_save(watcher, session_id):
    global monitored_saves
    global session_saves
    folder = os.path.dirname(watcher.get_file())
    if folder not in monitored_saves:
        save_lock.acquire()
        monitored_saves[folder] = _load_save(watcher, session_id)
        save_lock.release()
        monitored_saves[folder]['updater'].start()
    session_saves[session_id] = folder
    return monitored_saves[folder]


def activate_save(folder):
    if folder in monitored_saves:
        if not monitored_saves[folder]['updater'].is_alive():
            monitored_saves[folder]['updater'].start()


def append_save(watcher, snapshot):
    global monitored_saves
    folder = os.path.dirname(watcher.get_file())
    if folder in monitored_saves:
        save_lock.acquire()
        monitored_saves[folder]['snaps'].append(snapshot)
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


def get_session_save(session_id):
    return session_saves[session_id] if session_id in session_saves else None


def _debug_watcher_update(save, folder, watcher):
    pass


def _watcher_update(save, folder, watcher):
    save['watcher'].refresh()
    if save['watcher'].new_data_available():
        snap = snapper.build_snapshot_from_watcher(save['watcher'])
        save['snaps'].append(snap)
        for session in save['sessions']:
            sessions.notify_session(session, snap)


def _watch_save(watcher):
    global monitored_saves
    folder = os.path.dirname(watcher.get_file())

    while True:
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
            monitored_saves.pop(folder)
            save_lock.release()
            break

        # Refresh
        _watcher_update(save, folder, watcher)

        time.sleep(1)
