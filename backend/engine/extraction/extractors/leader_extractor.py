from .extractor import Extractor
from engine.extraction.isolation import util


class LeaderExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'leaders'

    def extract_data(self, state, empire):
        md = self.isolation_layer.get_metadata(state)
        empire_data = self.isolation_layer.get_empire(state, empire)
        leaders = self.isolation_layer.get_leaders(state, empire_data['leader_ids'])

        today = md['date_components']
        leaders = [
            {
                **leader,
                'actual_age': leader['hire_age'] + util.date_diff_days(today, util.parse_date(leader['hire_date'])) / util.DAYS_PER_YEAR
            } for leader in leaders
        ]
        types = set([leader['type'] for leader in leaders])
        type_breakdown = {
            ltype: len([leader for leader in leaders if leader['type'] == ltype])
            for ltype in types
        }
        ages = [leader['actual_age'] for leader in leaders]
        hire_ages = [leader['hire_age'] for leader in leaders]
        levels = [leader['level'] for leader in leaders]
        percent_male = sum([1 for leader in leaders if leader['gender'] == 'male']) / len(leaders)
        percent_female = sum([1 for leader in leaders if leader['gender'] == 'female']) / len(leaders)
        return {
            'total': len(leaders),
            'max_age': max(ages),
            'avg_age': sum(ages) / len(ages),
            'avg_hire_age': sum(hire_ages) / len(hire_ages),
            'max_hire_age': max(hire_ages),
            'avg_level': sum(levels) / len(levels),
            'max_level': max(levels),
            'percent_male': percent_male,
            'percent_female': percent_female,
            'percent_ungendered': 1 - percent_female - percent_male,
            **type_breakdown
        }
