import ctypes
from ctypes import wintypes
from ctypes import windll
from pathlib import Path
import string
import time
import os

from .watcher import Watcher

CSIDL_PERSONAL = 5       # My Documents
SHGFP_TYPE_CURRENT = 0   # Get current, not default value

PATH_SUFFIX = 'Paradox Interactive/Stellaris/save games' 
TIMEOUT = 300

STEAM_DIRS = [
    'Steam',
    'Program Files/Steam',
    'Program Files (x86)/Steam'
]
STEAM_USERDATA = 'userdata'
STELLARIS_ID = '281990'
CLOUD_SAVE_SUFFIX = 'remote/save games'


def _get_drives():
    drives = []
    bitmask = windll.kernel32.GetLogicalDrives()
    for letter in string.ascii_uppercase:
        if bitmask & 1:
            drives.append(letter)
        bitmask >>= 1
    return drives


def _find_steam():
    drives = [f'{drive}:\\' for drive in _get_drives()]
    for drive in drives:
        for folder in STEAM_DIRS:
            path = os.path.join(drive, folder)
            if os.path.isdir(path):
                return path
    return None


def _get_docs_save_dir():
    docs_path = ctypes.create_unicode_buffer(wintypes.MAX_PATH)
    ctypes.windll.shell32.SHGetFolderPathW(None, CSIDL_PERSONAL, None, SHGFP_TYPE_CURRENT, docs_path)
    return os.path.join(str(docs_path.value), PATH_SUFFIX)


def _get_save_dirs():
    save_dirs = []

    steam_dir = _find_steam()
    if steam_dir:
        user_path = os.path.join(steam_dir, STEAM_USERDATA)
        users = os.listdir(user_path)
        for user in users:
            save_dir = os.path.join(user_path, user,STELLARIS_ID, CLOUD_SAVE_SUFFIX)
            save_dirs.append(save_dir)
    else:
        print('Failed to find Steam install, only local saves will be searched')
    
    save_dirs.append(_get_docs_save_dir())
    return save_dirs


def find_saves():
    save_folders = []
    for f in _get_save_dirs():
        save_folders.extend(
            os.path.join(f, file) for file in os.listdir(f)
        )
    watchers = [
        Watcher(Path(folder).stem.split('_')[0], folder) 
        for folder in save_folders if len(folder.split('_')) > 0
    ]
    return watchers


def find_save(folders, wait_for_save):
    print(f'Searching for files in: {folders}')
    save_folders = []
    for f in folders:
        save_folders.extend(
            os.path.join(f, file) for file in os.listdir(f)
        )
    print(f'Found {len(save_folders)} saves')

    watchers = [
        Watcher(Path(folder).stem.split('_')[0], folder) 
        for folder in save_folders if len(folder.split('_')) > 0
    ]
    start_time = time.time()

    if not watchers:
        print('No saves present')
        return None

    if wait_for_save:
        print(f'Waiting for new save for {TIMEOUT} seconds')
        while time.time() - start_time < TIMEOUT:
            for watcher in watchers:
                if watcher.new_data_available():
                    return watcher
        return None
    else:
        print('Selecting latest save')
        newest_watcher = watchers[0]
        for watcher in watchers:
            if watcher.time() > newest_watcher.time():
                newest_watcher = watcher
        return newest_watcher
