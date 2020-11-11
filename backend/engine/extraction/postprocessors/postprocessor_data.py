KEY = 'postprocessors'


class PostprocessorData:
    def __init__(self, gamestate, snapshot, snap_history):
        self.gamestate = gamestate
        self.snapshot = snapshot
        self.snap_history = snap_history
        self.current_empire = None
        self.current_processor = None
        self.empire_snapshot_list = None
        if KEY not in snapshot:
            self.snapshot[KEY] = {}

    def setup_empire(self, empire):
        self.snapshot[KEY][empire] = {}
        if len(self.snap_history) > 0 and KEY in self.snap_history[-1] and empire in self.snap_history[-1][KEY]:
            self.snapshot[KEY][empire] = self.snap_history[-1][KEY][empire]
        self.current_empire = empire

        self.empire_snapshot_list = []
        for snap in self.snap_history:
            if self.current_empire in snap['empires']:
                self.empire_snapshot_list.append(snap)

    def setup_postprocessor(self, processor_name):
        if self.current_empire == None:
            raise Exception('current_empire not set, call setup_empire() before setup_postprocessor()')
        data = self.snapshot[KEY][self.current_empire]
        if processor_name not in data:
            data[processor_name] = {}
        self.current_processor = processor_name

    def get_processor_data(self):
        self._check()
        return self.snapshot[KEY][self.current_empire][self.current_processor]

    def get_empire_snapshots(self):
        self._check()
        return self.empire_snapshot_list

    def get_full_snapshot(self):
        return self.snapshot

    def get_empire_snapshot(self):
        self._check()
        return self.snapshot['empires'][self.current_empire]

    def get_gamestate(self):
        return self.gamestate

    def get_empire(self):
        self._check()
        return self.current_empire

    def _check(self):
        if self.current_empire == None or not self.current_processor:
            raise Exception('setup_empire() and setup_postprocessor() must both be called before data access')
