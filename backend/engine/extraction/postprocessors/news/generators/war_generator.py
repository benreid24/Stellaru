import random

from ..headline_generator import HeadlineGenerator
from ..common import ensure_exists

DATA_KEY = 'handled_wars'

PRIMARY_ATTACKER_HEADLINES = [
    'War Declared on {defender}',
    'Hostilities Commence with {defender} as War is Formally Declared'
]

PRIMARY_ATTACKER_BODY = (
    'After a tumultuous period of military preparations and deteriorating diplomatic relations '
    'with {defender} war has been formally declared. Fleet engagement is imminent as forces move '
    'toward enemy systems. Citizens near hostile borders are advised to heed all official notices '
    'and be prepared for evacuation or shelter in place protocols.'
)

ALLY_ATTACKER_HEADLINES = [
    'Military Mobilizes to Aid {attacker} Against {defender}',
    'Ally Declares War! The {attacker} Invades the {defender}'
]

ALLY_ATTACKER_BODY = (
    'We have declared war on the {defender} after our ally, the {attacker} issued their own declaration '
    'of war. Only time will tell if this is a strategic move or a foolish blunder. More than {count} empires '
    'have been embroiled in this conflict. Citizens are advised to stay current on local planetary advisories '
    'and to be prepared to evacuate or shelter in place if necessary.'
)

PRIMARY_DEFENDER_HEADLINES = [
    'INVASION! {attacker} Declares War',
    '{attacker} Declares War on our Nation'
]

PRIMARY_DEFENDER_BODY = (
    'All attempts at negotiation with with the {attacker} have failed and they have declared war. '
    'All military installations are on high alert and fleets are preparing for mobilization against '
    'all foreign threats. Citizens near hostile borders are advised to remain indoors and prepare for '
    'possible evacuation should enemy fleets overwhelm border defenses.'
)

ALLY_DEFENDER_HEADLINES = [
    'ALLY INVADED! {attacker} Has Mobilized Fleets to Invade the {defender}',
    'War Declared on {attacker} After Agression Break Out with {defender}'
]

ALLY_DEFENDER_BODY = (
    'War breaks out as the {attacker} issues a formal declaration of war against the {defender}. '
    'Our fleets are preparing to mobilize to their aid. Over {count} empires have joined the fray. '
    'We can only hope that this conflict can be ended as quickly as possible. Border defenses have been '
    'placed on high alert and citizens are advised to remain vigilant and to ensure familiarity with '
    'local shelter in place procedures should the need arise.'
)

NEUTRAL_HEADLINES = [
    'War Breaks Out Between the {attacker} and the {defender}',
    'Hostilities Erupt as the {attacker} Mobilizes Fleets to Invade the {defender}',
    '{defender} Plunged Into War as the {attacker} Invades'
]

NEUTRAL_BODY = (
    'War has broken out elsewhere in the galaxy. The {attacker} has issued a formal declaration of war '
    'against the {defender} and has mobilized its fleets for invasion. Time will tell who will prevail.'
)

LARGE_COUNT_CUTOFF = 4

LARGE_NEUTRAL_HEADLINES = [
    'Galaxy Erupts in Violence as More Than {count} Empires Enter Conflict',
    'Great War Begins! The {attacker} invades the {defender}, {count} Empires Join'
]

LARGE_NEUTRAL_BODY = (
    'Over {count} empires have declared war, engulfing a large part of the galaxy in conflict. '
    'How this will shape the future of galactic politics remains to be seen. The atmosphere is tense '
    'in neighboring empires as fears of the conflict spreading rise.'
)


class WarGenerator(HeadlineGenerator):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def generate(self, state, empire, snapshot, snapshot_hist, static_meta):
        ensure_exists(static_meta, DATA_KEY, [])

        wars = self.isolation_layer.get_wars(state)
        headlines = []
        for war in wars:
            if war['id'] in static_meta[DATA_KEY]:
                continue

            attacker_name = self._get_primary_name(state, empire, war['attackers'])
            defender_name = self._get_primary_name(state, empire, war['defenders'])
            if not attacker_name and not defender_name:
                print('unknown war')
                continue
            attacker_name = attacker_name if attacker_name else 'Unknown Empire'
            defender_name = defender_name if defender_name else 'Unknown Empire'
            count = len(war['attackers']) + len(war['defenders'])

            headline = None
            body = None
            meta = {
                'attackers': list(war['attackers'].keys()),
                'defenders': list(war['defenders'].keys()),
                'count': count
            }
            if empire in war['attackers']:
                if war['attackers'][empire] == 'Main':
                    headline = random.choice(PRIMARY_ATTACKER_HEADLINES).format(defender=defender_name)
                    body = PRIMARY_ATTACKER_BODY.format(defender=defender_name)
                else:
                    headline = random.choice(ALLY_ATTACKER_HEADLINES).format(attacker=attacker_name, defender=defender_name)
                    body = ALLY_ATTACKER_BODY.format(attacker=attacker_name, defender=defender_name, count=count)
            elif empire in war['defenders']:
                if war['defenders'][empire] == 'Main':
                    headline = random.choice(PRIMARY_DEFENDER_HEADLINES).format(attacker=attacker_name)
                    body = PRIMARY_DEFENDER_BODY.format(attacker=attacker_name)
                else:
                    headline = random.choice(ALLY_DEFENDER_HEADLINES).format(attacker=attacker_name, defender=defender_name)
                    body = ALLY_DEFENDER_BODY.format(attacker=attacker_name, defender=defender_name, count=count)
            else:
                if count > LARGE_COUNT_CUTOFF:
                    headline = random.choice(LARGE_NEUTRAL_HEADLINES).format(attacker=attacker_name, defender=defender_name, count=count)
                    body = LARGE_NEUTRAL_BODY.format(attacker=attacker_name, defender=defender_name, count=count)
                else:
                    headline = random.choice(NEUTRAL_HEADLINES).format(attacker=attacker_name, defender=defender_name)
                    body = NEUTRAL_BODY.format(attacker=attacker_name, defender=defender_name)
            
            headlines.append(self.create_headline(headline, body, snapshot, meta))
            static_meta[DATA_KEY].append(war['id'])

        return headlines


    def _get_primary_name(self, state, empire, pdict):
        for pid, main in pdict.items():
            if main == 'Main':
                return self.isolation_layer.get_empire_name(state, empire, pid)
        if len(pdict) > 0:
            return self.isolation_layer.get_empire_name(state, empire, pdict.values()[0])
        return None
