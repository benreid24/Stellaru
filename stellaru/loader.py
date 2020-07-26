DAYS_PER_MONTH = 30
DAYS_PER_YEAR = DAYS_PER_MONTH * 12

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
        'admiral': 12,
        'avg_age': 140,
        'max_age': 288
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

    snapshot = {
        'name': state['country'][empire]['name'],
        'active_empires': len(get_empires(state).keys()),
        'edict_count': len(state['country'][empire]['edicts']),
        'leaders': _get_leaders(state, empire),
        'standing': _get_standing(state, empire),
        'war': _get_wars(state, empire),
        'systems': _get_systems(state, empire)
    }
    return snapshot


def _parse_date(date_str):
    comps = date_str.split('.')
    if len(comps) != 3:
        return {'y': 0, 'm': 0, 'd': 0}
    return {
        'y': int(comps[0]),
        'm': int(comps[1]),
        'd': int(comps[2])
    }


def _date_diff_days(future, past):
    year_diff = future['y'] - past['y']
    month_diff = future['m'] + (12 - past['m'])
    day_diff = future['d'] + (DAYS_PER_MONTH - past['d'])
    return year_diff * DAYS_PER_YEAR + month_diff * DAYS_PER_MONTH + day_diff


def _get_leaders(state, empire):
    date = _parse_date(state['date'])
    leader_ids = state['country'][empire]['owned_leaders']
    leader_pool = state['leaders']
    leaders = [leader_pool[lid] for lid in leader_ids if lid in leader_pool]
    classes = set([leader['class'] for leader in leaders])
    leaders = [
        {
            **leader,
            'actual_age': leader['age'] + _date_diff_days(date, _parse_date(leader['date'])) / DAYS_PER_YEAR
        }
        for leader in leaders
    ]

    breakdown = {
        ltype: len([leader for leader in leaders if leader['class'] == ltype])
        for ltype in classes
    }
    leader_info = {
        'total': len(leaders),
        'max_age': max(leader['actual_age'] for leader in leaders),
        'avg_age': sum(leader['actual_age'] for leader in leaders) / len(leaders),
        'avg_hire_age': sum([leader['age'] for leader in leaders]) / len(leaders),
        'max_hire_age': max([leader['age'] for leader in leaders]),
        'avg_level': sum([leader['level'] for leader in leaders]) / len(leaders),
        'max_level': max([leader['level'] for leader in leaders]),
        'percent_male': sum([1 for leader in leaders if leader['gender'] == 'male']) / len(leaders)
    }
    return {**breakdown, **leader_info}


def _get_standing(state, empire):
    return {
        'victory_rank': state['country'][empire]['victory_rank'],
        'tech_power': state['country'][empire]['tech_power'],
        'economy_power': state['country'][empire]['economy_power'],
        'military_power': state['country'][empire]['military_power']
    }


def _get_wars(state, empire):
    active_wars = [war for key, war in state['war'].items() if isinstance(war, dict)]
    offense_wars = sum([
        1 for war in active_wars if empire in
            [attacker['country'] for attacker in war['attackers']]
    ])
    defense_wars = sum([
        1 for war in active_wars if empire in
            [defender['country'] for defender in war['defenders']]
    ])
    return {
        'total': len(active_wars),
        'participation': offense_wars + defense_wars,
        'attacker': offense_wars,
        'defender': defense_wars
    }


def _get_systems(state, empire):
    surveyed_ids = state['country'][empire]['surveyed']
    surveyed_stars = sum([
        1 for sid in surveyed_ids
        if sid in state['galactic_object'] and state['galactic_object'][sid]['type'] == 'star'
    ])
    owned = [
        base for bid, base in state['starbase_mgr']['starbases'].items()
        if isinstance(base, dict) and base['owner'] == empire]
    upgraded = sum(1 for base in owned if base['level'] != 'starbase_level_outpost')
    return {
        'surveyed_objects': len(surveyed_ids),
        'surveyed_systems': surveyed_stars,
        'owned': len(owned),
        'starbases': upgraded
    }