from .extractor import Extractor


class TechExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'tech'

    def extract_data(self, state, empire):
        tech = self.isolation_layer.get_tech(state, empire)
        tech['output']['total'] = sum([
            output for output in tech['output'].values()
        ])
        return tech
