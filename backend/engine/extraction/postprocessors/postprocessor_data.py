KEY = 'postprocessors'


class PostprocessorData:
    def __init__(self, gamestate, snapshot, snap_history):
        self.gamestate = gamestate
        self.snapshot = snapshot
        self.snap_history = snap_history
        self.current_empire = None
        self.current_processor = None
        self.empire_snapshot_list = None
        self.empire_processor_history = None
        if KEY not in snapshot:
            self.snapshot[KEY] = {}

    def setup_empire(self, empire):
        self.snapshot[KEY][empire] = {
            'static': {},
            'dynamic': {}
        }
        if len(snap_history) > 0 and KEY in self.snap_history[-1] and empire in self.snap_history[-1][KEY]:
            self.snapshot[KEY][empire]['static'] = self.snap_history[-1][KEY][empire]['static']
        self.current_empire = empire

    def setup_postprocessor(self, processor_name):
        if not self.current_empire:
            raise Exception('current_empire not set, call setup_empire() before setup_postprocessor()')
        data = self.snapshot[KEY][self.current_empire]
        if processor_name not in data['static']:
            data['static'][processor_name] = {}
        data['dynamic'][processor_name] = {}
        snap_hist = []
        custom_hist = []
        for snap in self.snap_history:
            if self.current_empire in snap['empires']:
                snap_hist.append(snap)
            if KEY in snap and self.current_empire in snap[KEY]:
                if processor_name in snap[KEY][empire]['dynamic']:
                    custom_hist.append(snap[KEY][self.current_empire]['dynamic'][processor_name])
        self.empire_snapshot_list = snap_hist
        self.empire_processor_history = custom_hist
        self.current_processor = processor_name

    def get_processor_static_data(self):
        self._check()
        return self.snapshot[KEY][self.current_empire][self.current_processor]['static']

    def get_processor_current_data(self):
        self._check()
        return self.snapshot[KEY][self.current_empire][self.current_processor]['dynamic']

    def get_processor_history(self):
        self._check()
        return self.empire_processor_history

    def get_empire_snapshots(self):
        self._check()
        return self.empire_snapshot_list

    def get_current_snapshot(self):
        self._check()
        return self.snapshot['empires'][self.current_empire]

    def get_gamestate(self):
        return self.gamestate

    def get_empire(self):
        self._check()
        return self.current_empire

    def _check(self):
        if not self.current_empire or not self.current_processor:
            raise Exception('setup_empire() and setup_postprocessor() must both be called before data access')
