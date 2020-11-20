import random

from engine.extraction.isolation_layer import get_empires, empire_valid
from ..headline_generator import HeadlineGenerator
from ..common import ensure_exists

ALL_EMPIRES = 'all_empires'
CONTACTED_EMPIRES = 'contacted_empires'

NEW_EMPIRE_HEADLINES = [
    'The {name} Ratifies Constitution, Joins Galactic Stage',
    'New Empire Created, the {name} Enter the Fray',
    'The {name} Achieve FTL Travel, Recognized as a First Class Empire'
]
NEW_EMPIRE_BODIES = [
    'The {name} have joined the long list of empires that have operated in this galaxy.',
    'The {name} have been officially recognized by the Galactic Community as an empire.',
    'After a period of technological ascension, the {name} have reached the stars and made contact with other space faring empires.'
]

NEW_CONTACT_HEADLINES = [
    'Contact Made with Intelligent Space-Faring Aliens, the {name}',
    'New Empire Met, the {name}',
    'Intelligent Life Found! Contact Made with the {name}'
]
NEW_CONTACT_BODIES = [
    'Intelligent life has been found: communications have been established with an empire known as the {name}.',
    'A new empire has been met, the {name}. Time will tell if they are friend or foe.'
]

EMPIRE_DESTROYED_HEADLINES = [
    'The {name} Meets with Utter Defeat, Completely Destroyed',
    'Empire Eliminated, Galaxy Changed Forever. the {name} Are Gone'
]
EMPIRE_DESTROYED_BODIES = [
    'After many years of conflicts and hardships, the {name} have been completely eradicated.',
    'The people and culture of the {name} have been lost to the galaxy forever after the nation was destroyed.'
]

NAME_CHANGE_HEADLINE = 'The {old} Formally Changes Name to the {name}'
NAME_CHANGE_BODY = 'The empire once known as the {old} have declared their new galactic designation to be {name}.'


class EmpireGenerator(HeadlineGenerator):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def generate(self, state, empire_id, snapshot, snapshot_hist, static_meta):
        ensure_exists(static_meta, ALL_EMPIRES)
        ensure_exists(static_meta, CONTACTED_EMPIRES, [])
        headlines = []

        empires = get_empires(state)
        old_empires = static_meta[ALL_EMPIRES]
        static_meta[ALL_EMPIRES] = empires
        contacted = self.isolation_layer.get_known_empires(state, empire_id)
        contacted = [contact for contact in contacted if empire_valid(state, contact)]
        old_contacted = static_meta[CONTACTED_EMPIRES]
        static_meta[CONTACTED_EMPIRES] = contacted

        # New empires, renames
        for eid, empire in empires.items():
            if eid not in old_empires:
                if eid in contacted:
                    headlines.append(self.create_headline(
                        random.choice(NEW_EMPIRE_HEADLINES).format(name=empire),
                        random.choice(NEW_EMPIRE_BODIES).format(name=empire),
                        snapshot,
                        headline_type='new_empire'
                    ))
            elif empire != old_empires[eid]:
                headlines.append(self.create_headline(
                    NAME_CHANGE_HEADLINE.format(old=old_empires[eid], name=empire),
                    NAME_CHANGE_BODY.format(old=old_empires[eid], name=empire),
                    snapshot,
                    headline_type='name_change'
                ))
        
        # New contacts
        for contact in contacted:
            if contact not in old_contacted:
                name = self.isolation_layer.get_empire_name(state, empire_id, contact)
                headlines.append(self.create_headline(
                    random.choice(NEW_CONTACT_HEADLINES).format(name=name),
                    random.choice(NEW_CONTACT_BODIES).format(name=name),
                    snapshot,
                    headline_type='new_contact'
                ))
        
        # Destroyed empires
        for eid, empire in old_empires.items():
            if eid not in empires:
                headlines.append(self.create_headline(
                    random.choice(EMPIRE_DESTROYED_HEADLINES).format(name=empire),
                    random.choice(EMPIRE_DESTROYED_BODIES).format(name=name),
                    snapshot,
                    headline_type='empire_destroy'
                ))

        return headlines
