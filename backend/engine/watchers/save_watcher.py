import os

from engine import finder, parser
from engine.watchers.file_watcher import FileWatcher

SAVE_FILE = 'stellaru.zip'


class SaveWatcher:
    @staticmethod
    def extract_save_name(path):
        return os.path.normpath(path).split(os.sep)[-1]

    @staticmethod
    def _save_valid(path):
        try:
            return parser.save_valid(path)
        except:
            return False
    
    def __init__(self, watcher):
        self.watchers = [watcher] if isinstance(watcher, FileWatcher) else watcher
        if not isinstance(self.watchers, list):
            raise Exception('Invalid watcher parameter, expect FileWatcher or list of FileWatcher')
        if not self.watchers:
            raise Exception('No files to watch')
        self.save_name = SaveWatcher.extract_save_name(self.watchers[-1].get_directory())
        self.file_list = []
        self.latest_time = 0

    def name(self):
        return self.save_name

    def add_save_location(self, watcher):
        dirs = [watcher.get_directory() for watcher in self.watchers]
        if watcher.get_directory() not in dirs:
            self.watchers.append(watcher)
            return True
        return False

    def refresh(self):
        finder._refresh()
        self.file_list = []
        for watcher in self.watchers:
            watcher.refresh()
            self.file_list.extend(watcher.get_files())
        self.file_list = sorted(self.file_list, key=lambda f: f['time'], reverse=True)

    def has_history(self):
        data_file = self.get_data_file()
        return data_file and os.path.isfile(data_file)

    def new_data_available(self):
        self.refresh()
        if not self.file_list:
            return False
        return self.latest_time < self.file_list[0]['time']

    def time(self):
        self.refresh()
        if not self.file_list:
            return 0
        return self.file_list[0]['time']

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

    def get_file(self, clear_unread=True):
        self.refresh()
        selected = None
        for path in self.file_list:
            if self._save_valid(path['path']):
                selected = path
                break
        if not selected:
            return selected
        if clear_unread:
            self.latest_time = selected['time']
        return selected['path']

    def valid(self):
        return self.get_file(False)
