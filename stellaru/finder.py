import ctypes.wintypes
import time
import os

from .watcher import Watcher

CSIDL_PERSONAL = 5       # My Documents
SHGFP_TYPE_CURRENT = 0   # Get current, not default value

PATH_SUFFIX = 'Paradox Interactive/Stellaris/save games' 
TIMEOUT = 300

def get_save_dir():
    docs_path = ctypes.create_unicode_buffer(ctypes.wintypes.MAX_PATH)
    ctypes.windll.shell32.SHGetFolderPathW(None, CSIDL_PERSONAL, None, SHGFP_TYPE_CURRENT, docs_path)
    return os.path.join(str(docs_path.value), PATH_SUFFIX)


def find_save(directory, wait_for_save):
    
    print(f'Searching for files in: {directory}')
    save_folders = os.listdir(directory)
    print(f'Found {len(save_folders)} saves')

    watchers = [
        Watcher(folder.split('_')[0], os.path.join(directory, folder)) 
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
