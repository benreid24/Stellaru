from .extractor import Extractor


class FederationsExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'federations'

    def extract_data(self, state, empire):
        return self.isolation_layer.get_federations(state)
    