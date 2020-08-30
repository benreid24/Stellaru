import os

SAVE_FILE = 'stellaru.pickle'


class FolderWatcher:
    def __init__(self, directory):
        self.directory = directory
        self.latest_write = 0
        self.latest_read = 0
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
        ]
        self.valid = len(file_list) > 0
        self.has_history = SAVE_FILE in dir_files

        update = False
        for file in file_list:
            info = os.stat(file)
            
            if info.st_atime > self.latest_read:
                update = True
                self.latest_read = info.st_atime
                self.latest_file = file
            if info.st_mtime > self.latest_write:
                update = True
                self.new_data = True
                self.latest_write = info.st_mtime
                self.latest_file = file

        return update

    def time(self):
        return max(self.latest_read, self.latest_write)

    def new_data_available(self):
        return self.new_data

    def get_file(self):
        return self.latest_file
    
    def get_file_for_read(self):
        self.new_data = False
        return self.latest_file

    def get_directory(self):
        return self.directory