import os
from xdg import XDG_DATA_HOME

STEAM_DIR = 'Steam'
SAVE_DIR = 'Paradox Interactive/Stellaris/save games'

def find_steam():
    path = os.path.join(str(XDG_DATA_HOME), STEAM_DIR)
    if os.path.isdir(path):
        return path
    return None

def get_os_specific_save_dirs():
    path = os.path.join(str(XDG_DATA_HOME), SAVE_DIR)
    return [path]
