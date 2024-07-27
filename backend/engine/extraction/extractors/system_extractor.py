from .extractor import Extractor

class SystemExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'systems'

    def extract_data(self, state, empire):
        md = self.isolation_layer.get_empire(state, empire)
        systems = self.isolation_layer.get_surveyed_objects(state, empire)
        return {
            'surveyed_objects': systems['objects'],
            'surveyed_systems': systems['stars'],
            'owned': md['owned_systems'],
            'starbases': md['starbases']
        }
    
    def make_default(self, state, empire):
        return {
            'surveyed_objects': 0,
            'surveyed_systems': 0,
            'owned': 0,
            'starbases': 0
        }
