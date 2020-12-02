import os
from xdg import XDG_DATA_HOME, HOME

STEAM_DIR = 'Steam'
SAVE_DIR = 'Paradox Interactive/Stellaris/save games'
FLATPAK_DIR = '.var/app/com.valvesoftware.Steam/.local/share'

def find_steam():
    paths = [os.path.join(str(XDG_DATA_HOME), STEAM_DIR),   # old default path
             os.path.expanduser('~/.steam/steam'),  # new default path
             os.path.join(str(HOME), FLATPAK_DIR, STEAM_DIR)]  # path for flatpak steam version

    for path in paths:
        if os.path.isdir(path):
            return path
    return None

def get_os_specific_save_dirs():
    paths = [os.path.join(str(XDG_DATA_HOME), SAVE_DIR),
             os.path.join(str(HOME), FLATPAK_DIR, SAVE_DIR)]  # flatpak
    return paths
