import os
from pathlib import Path

STEAM_DIR = 'Library/Application Support/Steam'
SAVE_DIR = 'Documents/Paradox Interactive/Stellaris/save games'


def find_steam():
    path = os.path.join(str(Path.home()), STEAM_DIR)
    if os.path.isdir(path):
        return path
    return None


def get_os_specific_save_dirs():
    path = os.path.join(str(Path.home()), SAVE_DIR)
    return [path]
