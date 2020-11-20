import math

from engine.extraction.util import DAYS_PER_YEAR
from ..headline_generator import HeadlineGenerator
from ..common import ensure_exists

DATA_KEY = 'federations'

FEDERATION_CREATED_MEMBER_HEADLINE = 'The {empire} Joins the {name}, a New Federation'
FEDERATION_CREATED_MEMBER_BODY = (
    'The {empire} and {count} other empires have joined together as one under the flag of the newly created '
    'federation, the {name}. Government officials, both sovereign those from our new allies claim security '
    'and prosperity are the chief motivation for the alliance, however galactic neighbors worry that the '
    'newly aligned states may prove a powerful threat.'
)

FEDERATION_CREATED_HEADLINE = 'New Federation Forms! The {name} is Created'
FEDERATION_CREATED_BODY = (
    '{count} empires have joined together under the {name}, a newly created federation. Member states are '
    'guaranteed protection from the other members, and all members will now fight together under one flag. '
    'Neighboring empires fear the alliance may be the beginning of a powerful threat.'
)

FEDERATION_MEMBER_ADD_HEADLINE = '{empire} Joins the {name}'
FEDERATION_MEMBER_ADD_BODY = (
    'The {empire} has been granted membership by the members of the {name}. Nearby empires have expressed '
    'concern regarding the consolidation of power in the region, however federation members maintain that '
    'their primary motivation remains mutual defence.'
)

FEDERATION_MEMBER_LEAVE_HEADLINE = '{empire} Breaks Federation Agreement, Leaves the {name}!'
FEDERATION_MEMBER_LEAVE_BODY = (
    'The {empire} has decided to exit its federation, the {name}. Remaining members have denounced the action, '
    'though what actions they may take are unclear as of yet. Diplomats from the {empire} maintain that their '
    'reasons for leaving are due to misalignment of ideology, but many are concerned of the military implications '
    'of the {empire}\'s actions.'
)

FEDERATION_DISSOLVE_HEADLINE = '{name} Disbands!'
FEDERATION_DISSOLVE_BODY = (
    'After {length} years of cooporation, the remaining member states of the {name} have disbanded, each going their '
    'own way. Diplomats from each empire have assured the Galactic Community that relations will remain peaceful, but '
    'many have expressed doubt at their continued ability to negotiate with one another nonviolently.'
)


class FederationGenerator(HeadlineGenerator):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def generate(self, state, empire, snapshot, snapshot_list, static_meta):
        ensure_exists(static_meta, DATA_KEY)
        headlines = []

        old_feds = static_meta[DATA_KEY]
        federations = self.isolation_layer.get_federations(state)
        static_meta[DATA_KEY] = federations

        # New federations, member changes
        for fid, fed in federations.items():
            # New federations
            if fid not in old_feds:
                if empire in fed['members']:
                    headlines.append(
                        self.create_headline(
                            FEDERATION_CREATED_MEMBER_HEADLINE.format(
                                empire=self.isolation_layer.get_empire_name(state, empire, empire),
                                name=fed['name']
                            ),
                            FEDERATION_CREATED_MEMBER_BODY.format(
                                name=fed['name'],
                                empire=self.isolation_layer.get_empire_name(state, empire, empire),
                                count=len(fed['members'])
                            ),
                            snapshot,
                            headline_type='create_member'
                        )
                    )
                else:
                    headlines.append(
                        self.create_headline(
                            FEDERATION_CREATED_HEADLINE.format(
                                name=fed['name']
                            ),
                            FEDERATION_CREATED_BODY.format(
                                name=fed['name'],
                                count=len(fed['members'])
                            ),
                            snapshot,
                            headline_type='create'
                        )
                    )
                continue

            # Member added
            for member in fed['members']:
                if member not in old_feds[fid]['members']:
                    headlines.append(self.create_headline(
                        FEDERATION_MEMBER_ADD_HEADLINE.format(
                            name=fed['name'],
                            empire=self.isolation_layer.get_empire_name(state, empire, member)
                        ),
                        FEDERATION_MEMBER_ADD_BODY.format(
                            name=fed['name'],
                            empire=self.isolation_layer.get_empire_name(state, empire, member)
                        ),
                        snapshot,
                        headline_type='member_add'
                    ))

            # Member left
            for member in old_feds[fid]['members']:
                if member not in fed['members']:
                    headlines.append(self.create_headline(
                        FEDERATION_MEMBER_LEAVE_HEADLINE.format(
                            name=fed['name'],
                            empire=self.isolation_layer.get_empire_name(state, empire, member)
                        ),
                        FEDERATION_MEMBER_LEAVE_BODY.format(
                            name=fed['name'],
                            empire=self.isolation_layer.get_empire_name(state, empire, member)
                        ),
                        snapshot,
                        headline_type='member_leave'
                    ))

        # Federations destroyed
        for fid, fed in old_feds.items():
            if fid not in federations:
                headlines.append(self.create_headline(
                    FEDERATION_DISSOLVE_HEADLINE.format(
                        name=fed['name'],
                    ),
                    FEDERATION_DISSOLVE_BODY.format(
                        name=fed['name'],
                        length=math.floor((snapshot['date_days'] - fed['start_date']) / DAYS_PER_YEAR)
                    ),
                    snapshot,
                    headline_type='federation_destroy'
                ))

        return headlines
