from ..headline_generator import HeadlineGenerator


class LeaderGenerator(HeadlineGenerator):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def generate(self, state, empire_id, snapshot, snapshot_hist, static_meta):
        pass
