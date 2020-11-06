from .extractor import Extractor
from engine.extraction import util


class PlanetExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'planets'

    def extract_data(self, state, empire):
        planets = self.isolation_layer.get_planets(state, empire)

        pop_stats = util.basic_stats([len(planet['pops']) for planet in planets])
        type_sums = {}
        for planet in planets:
            planet['population'] = len(planet['pops'])
            planet.pop('pops')
            if planet['type'] not in type_sums:
                type_sums[planet['type']] = 1
            else:
                type_sums[planet['type']] += 1

        return {
            'total': len(planets),
            'list': planets,
            'types': type_sums,
            'districts': util.basic_stats([planet['districts'] for planet in planets]),
            'buildings': util.basic_stats([planet['buildings'] for planet in planets]),
            'sizes': util.basic_stats([planet['size'] for planet in planets]),
            'stability': util.basic_stats([planet['stability'] for planet in planets]),
            'amenities': util.basic_stats([planet['free_amenities'] for planet in planets]),
            'housing': util.basic_stats([planet['free_housing'] for planet in planets]),
            'crime': util.basic_stats([planet['crime'] for planet in planets]),
            'pops': pop_stats,
            'age_days': util.basic_stats([planet['age_days'] for planet in planets]),
            'age': util.basic_stats([planet['age'] for planet in planets])
        }
