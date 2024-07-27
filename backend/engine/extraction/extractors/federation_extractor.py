from .extractor import Extractor


class FederationExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'federation'

    def extract_data(self, state, empire):
        md = self.isolation_layer.get_empire(state, empire)
        if not md['federation']:
            return self.make_default(state, empire)
        fed = self.isolation_layer.get_federation(state, md['federation'])
        fed['leader'] = fed['leader'] == empire
        fed['members'] = len(fed['members'])
        return fed
    
    def make_default(self, state, empire):
        return {
                'name': '',
                'members': 0,
                'cohesion': 0,
                'xp': 0,
                'level': 0,
                'leader': False
            }
    