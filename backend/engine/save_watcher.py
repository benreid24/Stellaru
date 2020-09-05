import os

from .file_watcher import FileWatcher

SAVE_FILE = 'stellaru.pickle'


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
        self.watchers.append(watcher)

    def refresh(self):
        for watcher in self.watchers:
            watcher.refresh()

    def has_history(self):
        data_file = self.get_data_file()
        return data_file and os.path.isfile(data_file)

    def new_data_available(self):
        self.refresh()
        for watcher in self.wacthers:
            if watcher.new_data_available():
                return True
        return False

    def time(self):
        ftime = 0
        for watcher in self.watchers:
            if watcher.time() > ftime:
                ftime = watcher.time()
        return ftime

    def get_data_file(self):
        for watcher in self.watchers:
            path = os.path.join(watcher.get_directory(), SAVE_FILE)
            if os.path.isfile(path):
                return path
        if not self.watchers:
            return ''
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
