import os

from .file_watcher import FileWatcher


class SaveWatcher:
    def extract_save_name(path):
        folder = os.path.dirname(path)
        return os.path.normpath(folder).split(os.sep)
    
    def __init__(self, watcher):
        self.watchers = [watcher] if isinstance(watcher, FileWatcher) else watcher
        if not isinstance(self.watchers, list):
            raise Exception('Invalid watcher parameter, expect FileWatcher or list of FileWatcher')
        if not self.watchers:
            raise Exception('No files to watch')
        self.save_name = extract_save_name(watchers[-1].get_file_for_read())

    def name(self):
        return self.save_name

    def add_save_location(self, watcher):
        if extract_save_name(watcher.get_file_for_read()) != self.save_name:
            raise Exception('Save names do not match')
        self.watchers.append(watcher)

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
