from .extractor import Extractor


class MetadataExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return None
    
    def extract_data(self, state, empire):
        game_md = self.isolation_layer.get_metadata(state)
        empire = self.isolation_layer.get_empire(state, empire)

        empire_keys = ['name', 'player_name', 'edict_count', 'sprawl', 'type']
        return {
            **game_md,
            **{key: empire[key] for key in empire_keys}
        }
    
    def make_default(self, state, empire):
        return {
            'name': '<ERROR EXTRACTING SAVE>',
            'player_name': 'AI',
            'edict_count': 0,
            'sprawl': 0,
            'type': 'regular_ai',
            'date': '2200.1.1',
            'date_days': 0,
            'date_components': {
                'y': 2200,
                'm': 1,
                'd': 1,
                'active_empires': 0,
            }
        }
