from ..headline_generator import HeadlineGenerator
from ..common import ensure_exists

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
        'create_headline': 'Commercial Pact Ratified with the {name}',
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
    },
    {
        'data_key': 'current_open_borders',
        'relation_key': 'open_borders',
        'create_headline': 'Borders Opened to {name} Ships',
        'create_body': (
            'A treaty has just been signed allowing ships from the {name} to cross through our systems. The treaty includes '
            'provisions for both military and civilian ships and allows virtually unrestricted passage through our space. '
            'Proponents are celebrating the deal, saying that it will increase friendly relations and discovery of the galaxy, '
            'while opponents fear that allowing {name} ships free passage will allow them a strategic edge in expansion and may '
            'jeopardize government secrets.'
        ),
        'exit_headline': 'Borders Closed to {name} Ships',
        'exit_body': (
            'The free passage that {name} ships once enjoyed has been revoked, effect immediately. All ships currently traversing '
            'sovereign space have been escorted out by local military regimens. The revocation comes as diplomatic ties with the '
            '{name} have been deteriorating, with some fearing that the {name} may become a threat going forward.'
        ),
        'meta_type': 'open_borders'
    },
    {
        'data_key': 'current_migration',
        'relation_key': 'migration_treaty',
        'create_headline': 'Migration Now Allowed for Citizens of the {name}',
        'create_body': (
            'Diplomats from the {name} have just successfully negotiated a deal with the government allowing free movement of civilians '
            'between the two nations. Under the new agreement citizens from either nation may settle in the other, without regard to current '
            'residency status. Supporters of the deal are celebrating the agreement and are expecting the new freedom to help both economies '
            'and provide better prospects to individuals in both nations. Opponents of the pact are worried that the new stream of migrants '
            'will worsen job prospects for current citizens.'
        ),
        'exit_headline': 'Citizens of the {name} Barred Entry and Migration Rights',
        'exit_body': (
            'The people of the {name} have been prohibited entry as the migration pact between the two nations has been terminated. Some '
            'in the government tout the deals expiration as a victory, claiming that natural citizens will have more opportunity available '
            'to them. Some economists worry that the exiting of the agreement may stifle economic growth going forward. While current residents '
            'from the {name} are being allowed to stay, several xeno-rights groups are concerned that worse things may yet be to come for those '
            'who stay.'
        ),
        'meta_type': 'migration'
    },
    {
        'data_key': 'current_alliance',
        'relation_key': 'alliance',
        'create_headline': 'Military Alliance Formed with the {name}',
        'create_body': (
            'A formal pact has just been signed with the {name}, creating a military alliance between the two nations. Details of the agreement '
            'stipulate that each empire must come to the aid of the other if needed, and that no aggression may occur between either party. Supporters '
            'claim that the mutual defense will ensure the survival and prosperity of both empires, while opponents worry that future opportunities '
            'may be unavailable to us while the deal is active. Others have expressed concern about being pulled into needless conflict.'
        ),
        'exit_headline': 'BREAKING! Military Alliance with the {name} Dissolved!',
        'exit_body': (
            'The military agreement assuring nonviolence and mutual defense with the {name} has just been broken today. An exit provision of the treaty '
            'stipulates a period of nonagression between both parties and both empires appear keen on adhereing to that clause. Many are worried of what '
            'will happen once the nonagression period is over, while detractors of the pact are claiming that the future is bright. Will peace last? Only '
            'time will tell.'
        ),
        'meta_type': 'alliance'
    },
    {
        'data_key': 'current_rivals',
        'relation_key': 'rival',
        'create_headline': 'Formal Denouncement of the {name}',
        'create_body': (
            'Top diplomats in the government have issued a formal denouncement of the {name}. Complete misalignment of ambitions and ideals '
            'between the two nations has created a bitter rivalry. The government has sworn to impede the {name} whereever it can, including '
            'economic sanctions, blockage of space travel, and even military engagement and invasion. Many are satisfied with the hardened '
            'diplomatic stance on the {name}, while others caution that violence begets violence.'
        ),
        'exit_headline': 'Government Eases Stance on the {name}',
        'exit_body': (
            'The swath of economic and military policies aimed at undermining the galactic relevance of the {name} have been unilaterally '
            'rescinded without much explanation from government officials. Several leading political scientists theorize that the softened '
            'stance is an early sign of improving relations, while others conjecture that the {name} is simply no longer a threat. We can only '
            'wait and see how diplomatic relations evolve from here.'
        ),
        'meta_type': 'rival'
    },
    {
        'data_key': 'rivaled_by',
        'relation_key': 'rivaled',
        'create_headline': 'The {name} Introduces Hardened Diplomatic Policies Against Us!',
        'create_body': (
            'The {name} has formally introduced a series of measures aimed at hampering our nation at every turn. The bitter rivalry they have '
            'created threatens to harm the prosperity and stability of our nation, both internally and on the galactic stage. All trade has been '
            'prohibited, all borders are closed, and a {name} military invasion is a real possibility. Some officials are urging restraint, saying we '
            'should work to close this diplomatic rift, while many are saying that our time, effort, and resources would be better used building warships.'
        ),
        'exit_headline': 'The {name} Eases Policy, Ending Rivalry',
        'exit_body': (
            'Despite tense and sometimes violent relations with the {name} in the past, it appears as though relations have improved substantially. '
            'The {name} has ended many of their aggressive policies and stances aimed against us, an action which many hope will usher in a new age '
            'of cooporation and peace. While the change is largely considered a positive development, there are some who caution against so quickly '
            'forgiving past transgressions. Several staunch officials are even demanding that we continue current policies, despite any changes in '
            'the actions of the {name}.'
        ),
        'meta_type': 'rivaled'
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
