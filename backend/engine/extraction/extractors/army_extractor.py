from .extractor import Extractor


class ArmyExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'armies'

    def extract_data(self, state, empire):
        armies = self.isolation_layer.get_armies(state, empire)

        types = {}
        for army in armies:
            if army['type'] not in types:
                types[army['type']] = 1
            else:
                types[army['type']] += 1

        return {
            'total': len(armies),
            'types': types
        }
