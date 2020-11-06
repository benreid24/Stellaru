import os

SAVE_FILE = 'stellaru.zip'


class FileWatcher:
    def __init__(self, directory):
        self.directory = directory
        self.file_list = []
        self.refresh()

    def refresh(self):
        dir_files = os.listdir(self.directory)
        file_list = [
            os.path.join(self.directory, filename)
            for filename in dir_files
            if filename != SAVE_FILE
            and '.sav' in filename
            and '.stmp' != os.path.splitext(filename)[1]
        ]
        self.has_history = SAVE_FILE in dir_files
        self.file_list = [
            {'path': path, 'time': os.stat(path).st_mtime} for path in file_list
        ]

    def get_files(self):
        return self.file_list

    def get_directory(self):
        return self.directory
