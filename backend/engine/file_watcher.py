import os

from engine import parser

SAVE_FILE = 'stellaru.zip'


def _save_valid(path):
    try:
        parser.load_meta(path)
        return True
    except:
        return False


class FileWatcher:
    def __init__(self, directory):
        self.directory = directory
        self.latest_write = 0
        self.latest_file = ''
        self.valid = False
        self.refresh()
        self.new_data = False

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

        update = False
        for file in file_list:
            info = os.stat(file)
            
            if info.st_mtime > self.latest_write:
                if _save_valid(file):
                    self.valid = True
                    update = True
                    self.new_data = True
                    self.latest_write = info.st_mtime
                    self.latest_file = file

        return update

    def time(self):
        return self.latest_write

    def new_data_available(self):
        return self.new_data

    def get_file(self):
        return self.latest_file
    
    def get_file_for_read(self):
        self.new_data = False
        return self.latest_file

    def get_directory(self):
        return self.directory
