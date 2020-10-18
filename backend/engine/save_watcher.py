import os

from . import finder
from .file_watcher import FileWatcher

SAVE_FILE = 'stellaru.zip'


class SaveWatcher:
    @staticmethod
    def extract_save_name(path):
        folder = os.path.dirname(path)
        return os.path.normpath(folder).split(os.sep)[-1]
    
    def __init__(self, watcher):
        self.watchers = [watcher] if isinstance(watcher, FileWatcher) else watcher
        if not isinstance(self.watchers, list):
            raise Exception('Invalid watcher parameter, expect FileWatcher or list of FileWatcher')
        if not self.watchers:
            raise Exception('No files to watch')
        self.save_name = SaveWatcher.extract_save_name(self.watchers[-1].get_file_for_read())

    def name(self):
        return self.save_name

    def add_save_location(self, watcher):
        if SaveWatcher.extract_save_name(watcher.get_file_for_read()) != self.save_name:
            raise Exception('Save names do not match')
        dirs = [watcher.get_directory() for watcher in self.watchers]
        if watcher.get_directory() not in dirs:
            self.watchers.append(watcher)
            return True
        return False

    def refresh(self):
        finder._refresh()
        for watcher in self.watchers:
            watcher.refresh()

    def has_history(self):
        data_file = self.get_data_file()
        return data_file and os.path.isfile(data_file)

    def new_data_available(self):
        self.refresh()
        latest_watcher = None
        for watcher in self.watchers:
            if not latest_watcher or watcher.time() > latest_watcher.time():
                latest_watcher = watcher
        return latest_watcher.new_data_available()

    def time(self):
        ftime = 0
        for watcher in self.watchers:
            if watcher.time() > ftime:
                ftime = watcher.time()
        return ftime

    def get_data_file(self):
        if not self.watchers:
            return ''
        dfile = ''
        dfile_time = 0
        for watcher in self.watchers:
            path = os.path.join(watcher.get_directory(), SAVE_FILE)
            if os.path.isfile(path):
                info = os.stat(path)
                if info.st_mtime > dfile_time:
                    dfile_time = info.st_mtime
                    dfile = path
        if dfile:
            return dfile
        return os.path.join(self.watchers[0].get_directory(), SAVE_FILE)

    def get_file(self):
        self.refresh()
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

    def valid(self):
        for watcher in self.watchers:
            if not watcher.valid:
                return False
        return len(self.watchers) > 0
