from . import util

START_DATE = {
    'm': 1,
    'd': 1,
    'y': 2200
}

RELIC_SCORES = {
    'r_dragon_trophy': 1000,
    'r_khans_throne': 3000,
    'r_worm_scales': 1000,
    'r_rubricator': 1000,
    'r_galaxy': 2000,
    'r_omnicodex': 500,
    'r_surveyor': 200,
    'r_galatron': 20000,
    'r_ancient_sword': 200,
    'r_severed_head': 200,
    'r_prethoryn_queen': 5000,
    'r_unbidden_warlock': 5000,
    'r_contingency_core': 5000,
    'r_zro_crystal': 1000,
    'r_the_last_baol': 1000,
    'r_the_defragmentor': 1000,
    'r_reality_perforator': 5000,
    'r_pox_sample': 5000,
    'r_cryo_core': 5000,
    'r_war_forge': 5000
}

RESOURCE_INDICES = {
    'minerals': 2,
    'food': 3,
    'alloys': 9,
    'consumer_goods': 10,
    'volatile_motes': 11,
    'exotic_gases': 12,
    'rare_crystals': 13,
    'sr_living_metal': 14,
    'sr_zro': 15,
    'sr_dark_matter': 16
}

BASE_PRICES = {
    'minerals': 1,
    'food': 1,
    'alloys': 4,
    'consumer_goods': 2,
    'volatile_motes': 10,
    'exotic_gases': 10,
    'rare_crystals': 10,
    'sr_living_metal': 20,
    'sr_zro': 20,
    'sr_dark_matter': 20
}


def empire_valid(state, empire):
    if 'victory_rank' not in state['country'][empire]:
        return False
    if 'owned_planets' not in state['country'][empire]:
        return False
    return len(state['country'][empire]['owned_planets']) > 0


def get_empires(state):
    return {
        cid: empire['name'] 
        for cid, empire in state['country'].items() if isinstance(empire, dict) and empire_valid(state, cid)
    }


def get_metadata(state):
    return {
        'date': state['date'],
        'date_days': util.date_days(state['date']),
        'date_components': util.parse_date(state['date']),
        'active_empires': len(get_empires(state))
    }


def get_empire(state, empire):
    data = state['country'][empire]

    players = {}
    if 'player' in state:
        players = {player['country']: player['name'] for player in state['player']}
    player_name = players[empire] if empire in players else 'AI'
    if player_name == 'unknown':
        player_name = 'Player'

    relic_points = 0
    if 'relics' in data:
        for relic in data['relics']:
            if relic in RELIC_SCORES:
                relic_points += RELIC_SCORES[relic]
            else:
                print(f'Relic {relic} not configured in RELIC_SCORES')

    return {
        'name': data['name'],
        'player_name': player_name,
        'edict_count': len(data['edicts'] if 'edicts' in data else []),
        'sprawl': data['empire_size'] if 'empire_size' in data else 0,
        'leader_ids': data['owned_leaders'],
        'victory_rank': data['victory_rank'],
        'economy_power': data['economy_power'],
        'tech_power': data['tech_power'],
        'crisis_kills': data['crisis_kills'] if 'crisis_kills' in data else 0,
        'relic_points': relic_points,
        'federation': data['federation'] if 'federation' in data else None,
        'subjects': data['subjects'] if 'subjects' in data else [],
        'owned_systems': len([base for bid, base in state['starbase_mgr']['starbases'].items() if isinstance(base, dict) and base['owner'] == empire]),
        'starbases': data['num_upgraded_starbase']
    }


def get_leaders(state, leader_ids):
    all_leaders = state['leaders']
    leaders = [all_leaders[lid] for lid in leader_ids if lid in all_leaders]
    return [
        {
            'hire_date': leader['date'],
            'hire_age': leader['age'],
            'type': leader['class'],
            'level': leader['level'],
            'gender': leader['gender'] if 'gender' in leader else ''
        } for leader in leaders
    ]


def get_planets(state, empire):
    planets = [
        {
            'id': pid,
            **planet
        }
        for pid, planet in state['planets']['planet'].items()
        if isinstance(planet, dict) and 'owner' in planet and planet['owner'] == empire
    ]
    today = util.parse_date(state['date'])
    return [
        {
            'name': planet['name'],
            'size': planet['planet_size'],
            'type': planet['planet_class'].split('_')[-1].capitalize() if planet['planet_class'] != 'habitable' else 'Ring World Section',
            'age_days': util.date_diff_days(today, util.parse_date(planet['colonize_date']) if 'colonize_date' in planet else START_DATE),
            'age': util.date_diff_days(today, util.parse_date(planet['colonize_date']) if 'colonize_date' in planet else START_DATE) / util.DAYS_PER_YEAR,
            'pops': planet['pop'] if 'pop' in planet else [],
            'districts': len(planet['district']) if 'district' in planet else 0,
            'armies': len(planet['army']) if 'army' in planet else 0,
            'stability': planet['stability'],
            'amenities': planet['amenities'],
            'free_amenities': planet['free_amenities'],
            'amenities_usage': planet['amenities_usage'],
            'free_housing': planet['free_housing'],
            'total_housing': planet['total_housing']
        } for planet in planets
    ]


def get_pops(state, pop_ids):
    pops = [state['pop'][pid] for pid in pop_ids if pid in state['pop'] and isinstance(state['pop'][pid], dict)]
    return [
        {
            'species': state['species'][pop['species_index']]['name'] if pop['species_index'] < len(state['species']) else 'Unknown',
            'job': ' '.join([word.capitalize() for word in pop['job'].split('_')]),
            'category': pop['category'],
            'ethos': [ethic.split('_')[-1].capitalize() for _, ethic in pop['ethos'].items()]
        }
    ]


def get_federation(state, fed):
    if fed not in state['federation']:
        return None
    fed = state['federation'][fed]
    return {
        'members': fed['members']
    }


def get_wars(state):
    wars = [
        war for wid, war in state['war'].items()
        if isinstance(war, dict)
    ] if isinstance(state['war'], dict) else []
    attackers = [fighter['country'] for war in wars for fighter in war['attackers']]
    defenders = [fighter['country'] for war in wars for fighter in war['defenders']]
    all_participants = set([*attackers, *defenders])
    return {
        'total': len(wars),
        'all_participants': all_participants,
        'attackers': attackers,
        'defenders': defenders,
    }


def get_surveyed_objects(state, empire):
    surveyed_ids = state['country'][empire]['surveyed'] if 'surveyed' in state['country'][empire] else []
    surveyed_stars = sum([
        1 for sid in surveyed_ids
        if sid in state['galactic_object'] and state['galactic_object'][sid]['type'] == 'star'
    ])
    return {
        'objects': len(surveyed_ids),
        'stars': surveyed_stars
    }
