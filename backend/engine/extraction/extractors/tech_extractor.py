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
    
    def make_default(self, state, empire):
        return {
            'output': {
                'physics': 0,
                'society': 0,
                'engineering': 0,
                'total': 0
            },
            'completed_techs': 0,
            'available_techs': {
                'physics': 0,
                'society': 0,
                'engineering': 0
            }
        }
