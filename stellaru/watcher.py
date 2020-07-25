import os
import glob


class Watcher:
    def __init__(self, name, directory):
        print(f'Watching save {name} at: {directory}')

        self.name = name
        self.directory = directory
        self.latest_write = 0
        self.latest_read = 0
        self.latest_file = ''
        refresh()
        self.new_data = False

    def refresh(self):
        file_list = glob.glob(f'{self.directory}*.sav')

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
        self.new_data = False
        return self.latest_file