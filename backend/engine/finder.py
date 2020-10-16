import time
import os
import sys

from .save_watcher import SaveWatcher

from .file_watcher import FileWatcher
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

saves = {}


def _get_save_dirs():
    save_dirs = []

    steam_dir = os_finder.find_steam()
    if steam_dir:
        user_path = os.path.join(steam_dir, STEAM_USERDATA)
        users = os.listdir(user_path)
        for user in users:
            save_dir = os.path.join(user_path, user, STELLARIS_ID, CLOUD_SAVE_SUFFIX)
            save_dirs.append(save_dir)
    else:
        print('Failed to find Steam install, only local saves will be searched')
    
    save_dirs.extend(os_finder.get_os_specific_save_dirs())
    return save_dirs


def _refresh():
    save_folders = []
    for f in _get_save_dirs():
        try:
            save_folders.extend(
                [os.path.join(f, file) for file in os.listdir(f) if os.path.isdir(os.path.join(f, file))]
            )
        except:
            pass
    file_watchers = [
        FileWatcher(folder) 
        for folder in save_folders if len(folder.split('_')) > 0
    ]

    global saves
    new_saves = []
    for watcher in file_watchers:
        name = SaveWatcher.extract_save_name(watcher.get_file_for_read())
        if name in saves:
            if saves[name].add_save_location(watcher):
                new_saves.append(name)
        else:
            saves[name] = SaveWatcher(watcher)
            new_saves.append(name)
    return new_saves


def find_saves():
    _refresh()
    return [save for name, save in saves.items()]


def get_save(name):
    _refresh()
    return saves[name] if name in saves else None


def wait_for_save():
    start_time = time.time()

    while time.time() - start_time <= TIMEOUT:
        new_saves = _refresh()
        new_saves.extend([save for save in saves if get_save(save).new_data_available()])
        if new_saves:
            watchers = [get_save(save) for save in new_saves]
            ltime = 0
            ls = None
            for watcher in watchers:
                if watcher.time() > ltime:
                    ltime = watcher.time()
                    ls = watcher
            return ls
        time.sleep(3)
    
    return None
