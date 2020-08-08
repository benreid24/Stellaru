import os

STEAM_DIRS = [
    '/Steam',
    '/bin/Steam',
    '/usr/bin/Steam'
] # TODO - correct?


def find_steam():
    for folder in STEAM_DIRS:
        if os.path.isdir(folder): # TODO - use listdir and tolower for case insensitive
            return path
    return None


def get_os_specific_save_dirs():
    # TODO - find user dir and local saves
    return []
