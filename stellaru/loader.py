EXAMPLE_SNAPSHOT = {
    'name': 'The Raviscidian Ravagers',
    'active_empires': 8,
    'edict_count': 14,
    'unity': {
        'output': 1000,
        'traditions': 40,
        'ascension_perks': 8,
    },
    'systems': {
        'surveyed': 600,
        'owned': 100,
        'starbases': 29
    },
    'wars': {
        'total': 3,
        'participating': 1
    },
    'federation': {
        'members': 3, # 0 = not in one
        'cohesion': 100,
        'monthly_cohesion': 1
    },
    'leaders': {
        'total': 18,
        'scientist': 5,
        'general': 0,
        'governor': 1,
        'admiral': 12
    },
    'standing': {
        'victory_rank': 1,
        'military_power': 4000000,
        'tech_power': 31000,
        'economy_power': 31000
    },
    'economy': {
        'resource name': {
            'net': 200,
            'income': {
                'total': 1000,
                'starbases': {
                    'total': 200,
                    'base': 50,
                    'modules': 50,
                    'buildings': 50,
                    'defense': 50 # if possible
                },
                'stations': 50, # mining/research
                'ships': {
                    'total': 400,
                    'base': 200,
                    'components': 200
                },
                'armies': 50,
                'megastructures': 100,
                'planets': {
                    'total': 200,
                    'robots': 0,
                    'districts': 50,
                    'buildings': 100,
                    'jobs': {
                        'total': 50,
                        'job1': 25,
                        'job2': 25,
                        'etc': 0
                    }
                }
            },
            'expense': {
                'same breakdown': 'as income'
            }
        }
    },
    'tech': {
        'research': {
            'society': 200,
            'engineering': 200,
            'physics': 200
        },
        'completed': {
            'total': 200,
            'society': ['list', 'of techs'],
            'engineering': ['list', 'of techs'],
            'physics': ['list', 'of techs']
        },
        'available': {
            'total': 50,
            'society': ['list', 'of techs'],
            'engineering': ['list', 'of techs'],
            'physics': ['list', 'of techs']
        }
    },
    'planets': {
        'total': 30,
        'total_districts': 350,
        'planets': [
            {
                'name': 'Admin World',
                'size': 32,
                'type': 'Savannah'
            }
        ]
    },
    'pops': {
        'total': 1800,
        'species': {
            'species1': 900,
            'species2': 900
        },
        'jobs': {
            'job1': 900,
            'job2': 900
        }
    },
    'fleets': {
        'strength': 4000000,
        'ships': {
            'total': 202,
            'corvette': 100,
            'destroyers': 60,
            'cruisers': 20,
            'battlehips': 18,
            'titans': 2,
            'colossus': 1,
            'juggernaut': 1
        },
        'fleets': [
            {
                'name': 'Primary Task Force',
                'strength': 300000,
                'ships': {
                    'total': 200,
                    'corvette': 100,
                    'destroyers': 60,
                    'cruisers': 20,
                    'battlehips': 18,
                    'titans': 2
                }
            }
        ]
    },
    'armies': {
        'total': 400,
        'strength': 80000,
        'defense': {
            'total': 350,
            'strength': 40000,
             # TODO - planet breakdown? strongest?
        },
        'assault': {
            'total': 50,
            'strength': 40000
        }
    }
}


def get_empires(state):
    return {
        cid: empire['name'] 
        for cid, empire in state['country'].items() if isinstance(empire, dict)
    }


def build_snapshot(state, empire):
    if empire not in state['country']:
        print(f'Invalid empire: {empire}')
