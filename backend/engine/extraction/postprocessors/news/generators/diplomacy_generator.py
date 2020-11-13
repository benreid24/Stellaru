from ..headline_generator import HeadlineGenerator
from ..common import ensure_exists

RESEARCH_KEY = 'current_research'
COMMERCIAL_KEY = 'current_commercial'
MIGRATION_KEY = 'current_migration'
ALLIANCE_KEY = 'current_aliance'
RIVAL_KEY = 'current_rival'
ALL_KEYS = [RESEARCH_KEY, COMMERCIAL_KEY, MIGRATION_KEY, ALLIANCE_KEY, RIVAL_KEY]
# TODO - time series analyzer for relation_current and trust

DIPLOMACY_TYPES = [
    {
        'data_key': 'current_research',
        'relation_key': 'research_agreement',
        'create_headline': 'Research Agreement Formed with the {name}',
        'create_body': (
            'The scientific community is in a buzz after the signing of a deal with the '
            '{name} that allows the free sharing of research and ideas. Academics are '
            'praising the deal as a great leap forward for both empires\' discovery of the unknown.'
        ),
        'exit_headline': 'Scientific Collaboration Ceased with the {name}',
        'exit_body': (
            'Scientists are expressing concern over the termination of the research agreement with the '
            '{name}. Some experts claim that technological progress will be stymied by the termination '
            'of the agreement while others contend that the benefit was largely one sided.'
        ),
        'meta_type': 'research_agreement'
    },
    {
        'data_key': 'current_commerce',
        'relation_key': 'commercial_pact',
        'create_headline': 'Commercial Pact Ratified with {name}',
        'create_body': (
            'After a period of negotiations the final terms for a galactic commercial pact have been agreed upon '
            'and signed into treaty with the {name}. Economists from both sides are commending the deal and predicting '
            'healthy GDP growth for both economies as a result of increased trade opportunities for businesses.'
        ),
        'exit_headline': 'Commercial Treaty Voided with the {name}',
        'exit_body': (
            'Trade has broken down between the two economies as trade deficits widen with the {name}. Both sides claim '
            'unmet import quotas and asymmetrical tariffs as their reasons for breaking the agreement. Businesses will '
            'have to look elsewhere for growth opportunities say leading economists.'
        ),
        'meta_type': 'commercial_pact'
    }
]


class DiplomacyGenerator(HeadlineGenerator):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def generate(self, state, empire, snapshot, snapshot_hist, static_meta):
        [ensure_exists(static_meta, dtype['data_key'], []) for dtype in DIPLOMACY_TYPES]

        headlines = []
        relations = self.isolation_layer.get_relations(state, empire)
        for country, relation in relations.items():
            for dtype in DIPLOMACY_TYPES:
                if country not in static_meta[dtype['data_key']] and relation[dtype['relation_key']]:
                    static_meta[dtype['data_key']].append(country)
                    name = self.isolation_layer.get_empire_name(state, empire, country)
                    headlines.append(self.create_headline(
                        dtype['create_headline'].format(name=name),
                        dtype['create_body'].format(name=name),
                        snapshot,
                        {'type': dtype['meta_type'], 'action': 'create'}
                    ))
                elif country in static_meta[dtype['data_key']] and not relation[dtype['relation_key']]:
                    static_meta[dtype['data_key']].remove(country)
                    name = self.isolation_layer.get_empire_name(state, empire, country)
                    headlines.append(self.create_headline(
                        dtype['exit_headline'].format(name=name),
                        dtype['exit_body'].format(name=name),
                        snapshot,
                        {'type': dtype['meta_type'], 'action': 'exit'}
                    ))
        return headlines
