import random

from ..headline_generator import HeadlineGenerator
from ..common import ensure_exists

DATA_KEY = 'handled_treaties'

TREATY_NAME_TEMPLATES = [
    '{attacker} - {defender} Peace Accord',
    '{attacker} - {defender} Ceasefire',
    '{attacker} - {defender} Non Aggression Pact',
    '{attacker} - {defender} Treaty',
    'Treaty of {attacker}'
]

CREATION_HEADLINE_TEMPLATES = [
    '{name} Concludes',
    '{name} Ends Peacefully',
    '{name} Ceasefire',
    '{name} Hostilities Cease',
    'Peace Again, {name} Over',
]

CREATION_BODY_TEMPLATE = (
    '{war} ended with the signing of the {treaty} on {start_date}. Hostilities have ceased for now '
    'but only time will tell if peace will last. The {treaty} will last for {length} years '
    'and will expire on {end_date}.'
)

EXPIRATION_HEADLINE_TEMPLATES = [
    '{name} Expires, Will Peace Prevail?',
    '{name} No Longer Law, Galaxy on Edge',
    'No Longer Restricted by the {name}, Will Hostilities Resume?',
    'Peace Upheld by the {name} Jeopardized by Expiration of Deal',
    '{name} Ends'
]

EXPIRATION_BODY_TEMPLATE = (
    'The {name} which upheld peace between the {attacker} and the {defender} has reached '
    'its end date on {end_date}. with nothing left standing between conflict and harmony '
    'the galaxy stands waiting, ready for hostilities to breakout again.'    
)


class TreatyGenerator(HeadlineGenerator):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def generate(self, state, empire, snapshot, snapshot_hist, static_meta):
        ensure_exists(static_meta, DATA_KEY)

        headlines = []

        # Handle new treaties
        treaties = self.isolation_layer.get_treaties(state)
        for treaty in treaties:
            if treaty['id'] in static_meta[DATA_KEY]:
                continue

            attacker_name = self.isolation_layer.get_empire_name(state, empire, treaty['attackers'][0])
            defender_name = self.isolation_layer.get_empire_name(state, empire, treaty['defenders'][0])
            treaty_name = random.choice(TREATY_NAME_TEMPLATES).format(
                attacker=attacker_name, defender=defender_name
            )
            headline = random.choice(CREATION_HEADLINE_TEMPLATES).format(name=treaty['war_name'])
            body = CREATION_BODY_TEMPLATE.format(
                war=treaty['war_name'],
                treaty=treaty_name,
                start_date=treaty['start_date'],
                end_date=treaty['end_date'],
                length=self.isolation_layer.TREATY_LENGTH_YEARS
            )
            headlines.append(self.create_headline(headline, body, snapshot, {'type': 'create'}))
            static_meta[DATA_KEY][treaty['id']] = {
                'name': treaty_name,
                'attacker': attacker_name,
                'defender': defender_name,
                'end_date': treaty['end_date']
            }

        # Handle expired treaties
        current_treaty_ids = [treaty['id'] for treaty in treaties]
        expired = []
        for tid, info in static_meta[DATA_KEY].items():
            if tid not in current_treaty_ids:
                expired.append(tid)
                headline = random.choice(EXPIRATION_HEADLINE_TEMPLATES).format(name=info['name'])
                body = EXPIRATION_BODY_TEMPLATE.format(**info)
                headline = self.create_headline(headline, body, snapshot, {'type': 'expire'})
                headlines.append(headline)
        
        # Delete expired
        for tid in expired:
            static_meta[DATA_KEY].pop(tid)

        return headlines
