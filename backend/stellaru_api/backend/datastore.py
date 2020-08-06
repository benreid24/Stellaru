import json
import os
import time
from threading import Thread, Lock

from . import snapper
from . import sessions

SAVE_FILE = 'stellaru.json'

session_saves = {}
monitored_saves = []
save_lock = Lock()


def _load_save(watcher, session_id):
    folder = os.path.dirname(watcher.get_file())
    snaps = []
    if os.path.isfile(os.path.join(folder, SAVE_FILE)):
        with open(os.path.join(folder, SAVE_FILE), 'r') as f:
            snaps = json.loads(f.read())
    snap = snapper.build_snapshot_from_watcher(watcher)
    if not snaps or snaps[-1]['date'] != snap['date']:
        snaps.append(snap)
    return {
        'directory': folder,
        'name': snaps[0]['name'],
        'watcher': watcher,
        'sessions': [session_id],
        'snaps': snaps
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
        monitored_saves[folder] = _load_save(watcher)
        save_lock.release()
        updater = Updater(watcher)
        updater.start()
    session_saves[session_id] = folder


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


def get_save(watcher):
    folder = os.path.dirname(watcher.get_file())
    if folder in monitored_saves:
        return monitored_saves[folder]
    return None


def get_session_save(session_id):
    return session_saves[session_id] if session_id in session_saves else None


class Updater(Thread):
    def __init__(self, watcher):
        super.__init__()
        self.folder = os.path.dirname(watcher.get_file())

    def run(self):
        global monitored_saves
        while True:
            # Check deleted
            if self.folder not in monitored_saves:
                break
            save = monitored_saves[self.folder]

            # Check sessions expired
            save['sessions'] = [
                session for session in save['sessions']
                if not sessions.session_expired(session)
            ]
            if not save['sessions']:
                save_lock.acquire()
                monitored_saves.pop(self.folder)
                save_lock.release()
                break

            # Refresh
            if save['watcher'].new_data_available():
                snap = snapper.build_snapshot_from_watcher(save['watcher'])
                save['snaps'].append(snap)
                for session in save['sessions']:
                    sessions.notify_session(session, snap)

            time.sleep(1)        
