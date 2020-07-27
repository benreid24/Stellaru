import json
import os

from . import loader

SAVE_FILE = 'stellaru.json'


class Datastore:
    def __init__(self, directory):
        self.data = {}
        self.save_dir = directory
        self.save_file = os.path.join(directory, SAVE_FILE)
        if os.path.isfile(self.save_file):
            with open(self.save_file) as f:
                self.data = dict(
                    sorted(json.loads(f.read()).items(), key=lambda t: t[0], reverse=False)
                )
                self.data = {
                    int(key): value
                    for key, value in self.data.items()
                }

    def __del__(self):
        self.flush()

    def get_ordered_snapshots(self):
        return self.data

    def add_snapshot(self, snap, flush=True):
        year_days = snap['date_components']['y'] * loader.DAYS_PER_YEAR
        month_days = snap['date_components']['m'] * loader.DAYS_PER_MONTH
        day_index = snap['date_components']['d'] + year_days + month_days
        self.data[day_index] = snap
        if len(self.data) >= 2:
            if list(self.data.keys())[-2] > day_index:
                self.data = dict(sorted(self.data.items(), key=lambda t:t[0], reverse=False))
        if flush:
            self.flush()

    def flush(self):
        with open(self.save_file, 'w') as f:
            f.write(json.dumps(self.data))
