from .extractor import Extractor


class WarExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'war'

    def extract_data(self, state, empire):
        war = self.isolation_layer.get_wars(state)
        offense_wars = sum([1 for eid in war['attackers'] if empire == eid])
        defense_wars = sum([1 for eid in war['defenders'] if empire == eid])
        return {
            'total': war['total'],
            'all_participants': len(war['all_participants']),
            'participation': offense_wars + defense_wars,
            'attacker': offense_wars,
            'defender': defense_wars
        }
    
    def make_default(self, state, empire):
        return {
            'total': 0,
            'all_participants': 0,
            'participation': 0,
            'attacker': 0,
            'defender': 0
        }
