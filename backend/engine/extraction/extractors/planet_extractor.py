from .extractor import Extractor


class PlanetExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'planets'

    def extract_data(self, state, empire):
        planets = self.isolation_layer.get_planets(state, empire)

        type_sums = {}
        for planet in planets:
            if planet['type'] not in type_sums:
                type_sums[planet['type']] = 1
            else:
                type_sums[planet] += 1

        return {
            'total': len(planets),
            'list': planets,
            'types': type_sums,
            'districts': _basic_stats([planet['districts'] for planet in planets]),
            'buildings': _basic_stats([planet['buildings'] for planet in planets]),
            'sizes': _basic_stats([planet['size'] for planet in planets]),
            'stability': _basic_stats([planet['stability'] for planet in planets]),
            'amenities': _basic_stats([planet['free_amenities'] for planet in planets]),
            'housing': _basic_stats([planet['free_housing'] for planet in planets]),
            'crime': _basic_stats([planet['crime'] for planet in planets]),
            'pops': _basic_stats([len(planet['pops']) for planet in planets]),
            'age_days': _basic_stats([planet['age_days'] for planet in planets]),
            'age': _basic_stats([planet['age'] for planet in planets])
        }
