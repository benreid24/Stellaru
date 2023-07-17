# This file loads saves for versions 3.x.x
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
    'r_war_forge': 5000,
    'r_the_radiance': 1000,
    'r_toxic_god': 3000,
    'r_odryskan_crystal': 3000,
    'r_wormhole_key': 2500
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
    'sr_dark_matter': 20,
    'nanites': 20
}

MARKET_RESOURCES = [resource for resource, p in BASE_PRICES.items()]


def _strip_name(name):
    rm = [
        'SPEC',
        '_system',
        '_planet',
        'NAME'
    ]
    for r in rm:
        name = name.replace(r, '')
    return name.replace('_', ' ').strip()


def _gen_name(name_dict):
    # Do our best to gen the name from the new structure
    try:
        spec = None
        parts = []
        if 'variables' not in name_dict:
            parts.append(name_dict['key'].replace('NAME', ''))
        else:
            for v in name_dict['variables']:
                if 'This.' not in v['key']:
                    parts.append(_strip_name(v['value']['key']))
                else:
                    spec = _strip_name(v['value']['key'])
        parts = [p for p in parts if p]
        if spec:
            parts.insert(0, spec)
        return ' '.join(parts).strip()
    except Exception:
        return f'Error: {name_dict}'


def empire_valid(state, empire):
    if 'victory_rank' not in state['country'][empire]:
        return False
    if 'modules' not in state['country'][empire]:
        return False
    if 'standard_economy_module' not in state['country'][empire]['modules']:
        return False
    if 'owned_planets' not in state['country'][empire]:
        return False
    return len(state['country'][empire]['owned_planets']) > 0


def get_empires(state):
    return {
        cid: _gen_name(empire['name'])
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
        players = {player['country']: player['name']
                   for player in state['player']}
    player_name = players[empire] if empire in players else 'AI'
    if player_name == 'unknown':
        player_name = 'Player'

    empire_type = 'player'
    if player_name == 'AI':
        empire_type = 'fallen_empire' if 'personality' in data and 'fallen_empire' in data[
            'personality'] else 'regular_ai'

    relic_points = 0
    if 'relics' in data:
        for relic in data['relics']:
            if relic in RELIC_SCORES:
                relic_points += RELIC_SCORES[relic]
            else:
                print(f'Relic {relic} not configured in RELIC_SCORES')

    # starbases now in fleets
    fleet_ids = [
        of['fleet'] for of in state['country'][empire]['fleets_manager']['owned_fleets']
        if isinstance(of, dict)
    ]
    fleet_data = [(fid, state['fleet'][fid])
                  for fid in fleet_ids if fid in state['fleet']]
    starbase_count = 0
    for _, fleet in fleet_data:
        if fleet['name']['key'] == 'shipclass_starbase_name':
            starbase_count += 1

    return {
        'name': _gen_name(data['name']),
        'type': empire_type,
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
        'owned_systems': starbase_count,
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

    def _planet_name(name):
        # TODO - this is kind of jank and probably not correct
        try:
            if 'NEW_COLONY' in name['key']:
                sn = _strip_name(name['variables'][0]['value']['key'])
                n = name['key'].split('_')[-1]
                return sn if n == '1' else f'{sn} {n}'
            parts = name['key'].split('_')
            for i in range(len(parts)):
                if not parts[i].isupper():
                    return _strip_name('_'.join(parts[i:]))
            return name['key']

        except Exception:
            return f'<planet err: {name}>'

    return [
        {
            'name': _planet_name(planet['name']),
            'size': planet['planet_size'],
            'type': planet['planet_class'].split('_')[-1].capitalize() if planet['planet_class'] != 'habitable' else 'Ring World Section',
            'age_days': util.date_diff_days(today, util.parse_date(planet['colonize_date']) if 'colonize_date' in planet else START_DATE),
            'age': util.date_diff_days(today, util.parse_date(planet['colonize_date']) if 'colonize_date' in planet else START_DATE) / util.DAYS_PER_YEAR,
            'pops': planet['pop'] if 'pop' in planet else [],
            'buildings': len(planet['buildings']),
            'districts': len(planet['district']) if 'district' in planet else 0,
            'armies': len(planet['army']) if 'army' in planet else 0,
            'stability': planet['stability'],
            'crime': planet['crime'],
            'amenities': planet['amenities'],
            'free_amenities': planet['free_amenities'],
            'amenities_usage': planet['amenities_usage'],
            'free_housing': planet['free_housing'],
            'total_housing': planet['total_housing']
        } for planet in planets
    ]


def get_pops(state, pop_ids):
    pops = [state['pop'][pid] for pid in pop_ids if pid in state['pop']
            and isinstance(state['pop'][pid], dict)]

    return [
        {
            'species': _strip_name(state['species_db'][pop['species']]['name']['key']) if pop['species'] in state['species_db'] else 'Unknown',
            'job': ' '.join([word.capitalize() for word in pop['job'].split('_')]) if 'job' in pop else 'Unemployed',
            'category': pop['category'] if 'category' in pop else 'Unknown',
            'ethos': [ethic.split('_')[-1].capitalize() for ethic in pop['ethos'].values()] if 'ethos' in pop else []
        } for pop in pops
    ]


def get_federation(state, fed):
    if fed not in state['federation']:
        return None
    fed = state['federation'][fed]
    return {
        'name': fed['name'],
        'members': fed['members'],
        'cohesion': fed['federation_progression']['cohesion'],
        'xp': fed['federation_progression']['experience'],
        'level': fed['federation_progression']['levels'],
        'leader': fed['leader']
    }


def get_federations(state):
    return [{
        'id': fid,
        'name': f['name'],
        'members': f['members'],
        'leader': f['leader']
    } for fid, f in state['federation'].items() if isinstance(f, dict)]


def get_wars(state):
    wars = [
        war for wid, war in state['war'].items()
        if isinstance(war, dict)
    ] if isinstance(state['war'], dict) else []
    attackers = [fighter['country']
                 for war in wars for fighter in war['attackers']]
    defenders = [fighter['country']
                 for war in wars for fighter in war['defenders']]
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


def get_unity(state, empire):
    ap_count = len(state['country'][empire]['ascension_perks']
                   if 'ascension_perks' in state['country'][empire] else [])
    unity_income = sum([
        iset['unity'] for k, iset in state['country'][empire]['budget']['current_month']['income'].items()
        if 'unity' in iset
    ])
    adopted_trees = 0
    finished_trees = 0
    traditions = 0
    tradition_list = state['country'][empire]['traditions'] if 'traditions' in state['country'][empire] else []
    for trad in tradition_list:
        if 'adopt' in trad:
            adopted_trees += 1
        elif 'finish' in trad:
            finished_trees += 1
        else:
            traditions += 1
    return {
        'adopted_trees': adopted_trees,
        'finished_trees': finished_trees,
        'traditions': traditions,
        'ascension_perks': ap_count,
        'unity': unity_income
    }


def get_economy(state, empire):
    resources = state['country'][empire]['modules']['standard_economy_module']['resources']
    budgets = state['country'][empire]['budget']['current_month']
    return {
        'stockpile': resources,
        'income': budgets['income'],
        'spending': budgets['expenses']
    }


def get_market_prices(state, empire):
    try:
        global_index = None
        if 'galactic_market_access' in state['market'] and empire in state['market']['id']:
            global_index = state['market']['id'].index(empire)
        prices = {}
        for resource in MARKET_RESOURCES:
            fluctuation = 0
            if empire in state['market']['internal_market_fluctuations']['country']:
                index = state['market']['internal_market_fluctuations']['country'].index(
                    empire)
                resources = state['market']['internal_market_fluctuations']['resources'][index]
                if resource in resources:
                    fluctuation += resources[resource]
            if global_index:
                if state['market']['galactic_market_access'][global_index] > 0:
                    if 'fluctuations' in state['market']:
                        fluctuation += state['market']['fluctuations'][RESOURCE_INDICES[resource]]
            prices[resource] = BASE_PRICES[resource] + \
                fluctuation * BASE_PRICES[resource] / 100
        return prices
    except:
        name = _gen_name(state['country'][empire]['name'])
        print(
            f'Warning: Failed to get market prices for {empire} ({name}), using base prices')
        return BASE_PRICES


def get_build_queues(state, empire):
    build_queues = [
        {**queue, 'id': qid} for qid, queue in state['construction']['queue_mgr']['queues'].items()
        if isinstance(queue, dict) and queue['owner'] == empire
    ]
    for queue in build_queues:
        items = [
            item for item in state['construction']['item_mgr']['items'].items()
            if isinstance(item, dict) and item['queue'] == queue['id']
        ]
        queue['items'] = len(items)
    return [
        {
            'type': queue['type'],
            'simultaneous': queue['simultaneous'],
            'items': queue['items']
        } for queue in build_queues
    ]


def get_tech(state, empire):
    research = {
        'society': sum([
            prod['society_research'] for pid, prod
            in state['country'][empire]['budget']['current_month']['income'].items()
            if isinstance(prod, dict) and 'society_research' in prod
        ]),
        'physics': sum([
            prod['physics_research'] for pid, prod
            in state['country'][empire]['budget']['current_month']['income'].items()
            if isinstance(prod, dict) and 'physics_research' in prod
        ]),
        'engineering': sum([
            prod['engineering_research'] for pid, prod
            in state['country'][empire]['budget']['current_month']['income'].items()
            if isinstance(prod, dict) and 'engineering_research' in prod
        ])
    }
    completed = len(state['country'][empire]['tech_status']['technology']
                    if 'technology' in state['country'][empire]['tech_status'] else [])
    options = {
        stype: len(state['country'][empire]
                   ['tech_status']['alternatives'][stype])
        for stype in research.keys()
    }
    return {
        'output': research,
        'completed_techs': completed,
        'available_techs': options
    }


def get_fleets(state, empire):
    def _is_transport_fleet(state, fleet):
        try:
            for ship_id in fleet['ships']:
                if ship_id not in state['ships']:
                    continue
                if 'army' in state['ships'][ship_id]:
                    return True
        except:
            pass
        return False

    fleet_ids = [
        of['fleet'] for of in state['country'][empire]['fleets_manager']['owned_fleets']
        if isinstance(of, dict)
    ]
    fleet_data = [(fid, state['fleet'][fid]) for fid in fleet_ids]

    fleets = [
        {'id': fid, **fleet} for fid, fleet in fleet_data
        if ('civilian' not in fleet or fleet['civilian'] == 'no') and
        ('station' not in fleet or fleet['station'] == 'no') and
        not _is_transport_fleet(state, fleet)
    ]

    fleet_list = {}
    total_exp = 0
    total_ships = 0
    for fleet in fleets:
        if 'ships' in fleet:
            fleet_item = {
                'id': fleet['id'],
                'power': fleet['military_power'],
                'ship_count': len(fleet['ships']),
            }
            exps = []
            ship_types = {}
            for ship_id in fleet['ships']:
                stype = 'Unknown'
                if ship_id in state['ships']:
                    ship = state['ships'][ship_id]
                    ship_exp = ship['experience'] if 'experience' in ship else 0
                    exps.append(ship_exp)
                    total_exp += ship_exp
                    total_ships += 1
                    if ship['ship_design'] in state['ship_design']:
                        design = state['ship_design'][ship['ship_design']]
                        stype = design['ship_size'].capitalize()
                        if stype not in ship_types:
                            ship_types[stype] = 1
                        else:
                            ship_types[stype] += 1
            fleet_item['experience'] = util.basic_stats(exps)
            fleet_item['ships'] = ship_types
            fleet_list[fleet['id']] = fleet_item

    return {
        'fleets': fleet_list,
        'total_exp': total_exp,
        'total_ships': total_ships
    }


def get_armies(state, empire):
    armies = [
        army for aid, army in state['army'].items()
        if isinstance(army, dict) and army['owner'] == empire
    ]
    return [
        {
            'type': ' '.join([word.capitalize() for word in army['type'].split('_')])
        } for army in armies
    ]
