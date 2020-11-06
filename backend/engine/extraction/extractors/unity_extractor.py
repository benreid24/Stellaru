from .extractor import Extractor


class UnityExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'unity'

    def extract_data(self, state, empire):
        return self.isolation_layer.get_unity(state, empire)
