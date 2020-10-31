from .extractor import Extractor


class StandngExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'standing'

    def extract_data(self, state, empire):
        md = self.isolation_layer.get_empire(state, empire)
        return {
            'victory_rank': md['victory_rank'],
            'victory_points': self._get_victory_points(state, empire)
        }

    def _get_victory_points(self, state, empire, ignore_fed=False):
        md = self.isolation_layer.get_empire(state, empire)
        planets = self.isolation_layer.get_planets(state, empire)
        pops = []
        for planet in planets:
            pops.extend(planet['pops'])

        subject_score = 0
        for subject in md['subjects']:
            if subject != empire:
                vps = self._get_victory_points(state, subject, True)
                for k, score in vps.items():
                    subject_score += score * 0.5

        federation_score = 0
        if md['federation'] and not ignore_fed:
            fed = self.isolation_layer.get_federation(state, md['federation'])
            if fed:
                for member in fed['members']:
                    if member != empire:
                        vps = self._get_victory_points(state, member, True)
                        for k, score in vps.items():
                            federation_score += score * 0.1

        return {
            'Economy': md['economy_power'],
            'Technology': md['tech_power'] / 4,
            'Systems': md['owned_systems'] * 10,
            'Colonies': len(planets) * 50,
            'Pops': len(pops) * 2,
            'Subjects': subject_score,
            'Federation': federation_score,
            'Crisis Ships Killed': md['crisis_kills'] * 100,
            'Relics': md['relic_points']
        }
