from .extractor import Extractor


class PopExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'pops'

    def extract_data(self, state, empire):
        planets = self.isolation_layer.get_planets(state, empire)
        pops = []
        for planet in planets:
            pops.extend(self.isolation_layer.get_pops(state, planet['pops']))

        species_sums = {}
        job_sums = {}
        ethic_sums = {}
        cat_sums = {}
        for pop in pops:
            if pop['species'] not in species_sums:
                species_sums[pop['species']] = 1
            else:
                species_sums[pop['species']] += 1
            
            if pop['job'] not in job_sums:
                job_sums[pop['job']] = 1
            else:
                job_sums[pop['job']] += 1

            if pop['category'] not in cat_sums:
                cat_sums[pop['category']] = 1
            else:
                cat_sums[pop['category']] += 1

            for _, ethic_key in pop['ethos'].items():
                ethic = ethic_key.split('_')[-1].capitalize()
                if ethic not in ethic_sums:
                    ethic_sums[ethic] = 1
                else:
                    ethic_sums[ethic] += 1

        return {
            'total': len(pops),
            'jobs': job_sums,
            'species': species_sums,
            'categories': cat_sums,
            'ethics': ethic_sums
        }
