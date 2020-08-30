import os

from .file_watcher import FileWatcher


def _extract_save_name(path):
    folder = os.path.dirname(path)
    return os.path.normpath(folder).split(os.sep)


class SaveWatcher:
    def __init__(self, watcher):
        self.watchers = [watcher] if isinstance(watcher, FileWatcher) else watcher
        if not isinstance(self.watchers, list):
            raise Exception('Invalid watcher parameter, expect FileWatcher or list of FileWatcher')
        if not self.watchers:
            raise Exception('No files to watch')
        self.save_name = _extract_save_name(watchers[-1].get_file())

    def name(self):
        return self.save_name

    def new_data_available(self):
        for watcher in self.wacthers:
            if watcher.new_data_available():
                return True
        return False

    def get_file(self):
        path = None
        ftime = 0
        for watcher in self.watchers:
            f = watcher.get_file()  # Clear new data status for all
            if watcher.time() > ftime:
                ftime = watcher.time()
                path = f
        return path

    def get_file_for_read(self):
        path = None
        ftime = 0
        for watcher in self.watchers:
            if watcher.time() > ftime:
                ftime = watcher.time()
                path = watcher.get_file_for_read()
        return path
