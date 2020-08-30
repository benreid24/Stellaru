import time
import os
import sys

from .folder_watcher import FolderWatcher
if sys.platform == 'win32':
    from . import windows_finder as os_finder
elif sys.platform == 'darwin':
    from . import osx_finder as os_finder
elif sys.platform == 'linux':
    from . import linux_finder as os_finder
else:
    raise Exception(f'Unsupported operating system: {sys.platform}')

TIMEOUT = 300

STEAM_USERDATA = 'userdata'
STELLARIS_ID = '281990'
CLOUD_SAVE_SUFFIX = 'remote/save games'


def _get_save_dirs():
    save_dirs = []

    steam_dir = os_finder.find_steam()
    if steam_dir:
        user_path = os.path.join(steam_dir, STEAM_USERDATA)
        users = os.listdir(user_path)
        for user in users:
            save_dir = os.path.join(user_path, user,STELLARIS_ID, CLOUD_SAVE_SUFFIX)
            save_dirs.append(save_dir)
    else:
        print('Failed to find Steam install, only local saves will be searched')
    
    save_dirs.extend(os_finder.get_os_specific_save_dirs())
    return save_dirs


def find_saves():
    save_folders = []
    for f in _get_save_dirs():
        try:
            save_folders.extend(
                [os.path.join(f, file) for file in os.listdir(f)]
            )
        except:
            pass
    watchers = [
        FolderWatcher(folder) 
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
        FolderWatcher(folder) 
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
