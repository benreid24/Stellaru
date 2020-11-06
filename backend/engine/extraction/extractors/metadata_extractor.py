from .extractor import Extractor


class MetadataExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return None
    
    def extract_data(self, state, empire):
        game_md = self.isolation_layer.get_metadata(state)
        empire = self.isolation_layer.get_empire(state, empire)

        empire_keys = ['name', 'player_name', 'edict_count', 'sprawl']
        return {
            **game_md,
            **{key: empire[key] for key in empire_keys}
        }
