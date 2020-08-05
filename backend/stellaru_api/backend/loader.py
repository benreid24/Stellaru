DAYS_PER_MONTH = 30
DAYS_PER_YEAR = DAYS_PER_MONTH * 12

EC_SB = 'Starbases'
EC_SB_BASE = 'Base'
EC_SB_BUILDINGS = 'Buildings'
EC_SB_MODULES = 'Modules'
EC_TRADE = 'Trade'
EC_MEGA = 'Megastructures'
EC_STATIONS = 'Stations'
EC_SHIPS = 'Ships'
EC_SHIPS_BASE = 'Base'
EC_SHIPS_COMP = 'Components'
EC_PLANETS = 'Planets'
EC_PLANETS_DISTRICTS = 'Districts'
EC_PLANETS_BUILDINGS = 'Buildings'
EC_PLANET_POPS = 'Pops'
EC_PLANETS_JOBS = 'Jobs'
EC_LEADERS = 'Leaders'
EC_ARMIES = 'Armies'
EC_BASE = 'Base'

ECONOMY_CLASSES = {
    'trade_routes': [EC_TRADE],
    'megastructures': [EC_MEGA],
    'ships': [EC_SHIPS, EC_SHIPS_BASE],
    'ship_components': [EC_SHIPS, EC_SHIPS_COMP],
    'station_gatherers': [EC_SB, EC_SB_BUILDINGS],
    'station_researchers': [EC_SB, EC_SB_BUILDINGS],
    'starbase_stations': [EC_SB, EC_SB_BASE],
    'starbase_buildings': [EC_SB, EC_SB_BUILDINGS],
    'starbase_modules': [EC_SB, EC_SB_MODULES],
    'planet_buildings': [EC_PLANETS, EC_PLANETS_BUILDINGS],
    'planet_buildings_strongholds': [EC_PLANETS, EC_PLANETS_BUILDINGS],
    'planet_districts': [EC_PLANETS, EC_PLANETS_DISTRICTS],
    'planet_districts_cities': [EC_PLANETS, EC_PLANETS_DISTRICTS],
    'planet_districts_hab_energy': [EC_PLANETS, EC_PLANETS_DISTRICTS],
    'planet_districts_hab_research': [EC_PLANETS, EC_PLANETS_DISTRICTS],
    'planet_districts_hab_mining': [EC_PLANETS, EC_PLANETS_DISTRICTS],
    'planet_districts_hab_trade': [EC_PLANETS, EC_PLANETS_DISTRICTS],
    'planet_pop_assemblers': [EC_PLANETS, EC_PLANETS_JOBS, 'Assemblers'],
    'planet_farmers': [EC_PLANETS, EC_PLANETS_JOBS, 'Farmers'],
    'planet_miners': [EC_PLANETS, EC_PLANETS_JOBS, 'Miners'],
    'planet_technician': [EC_PLANETS, EC_PLANETS_JOBS, 'Technicians'],
    'planet_administrators': [EC_PLANETS, EC_PLANETS_JOBS, 'Administrators'],
    'planet_bureaucrats': [EC_PLANETS, EC_PLANETS_JOBS, 'Bureaucrats'],
    'planet_researchers': [EC_PLANETS, EC_PLANETS_JOBS, 'Researchers'],
    'planet_metallurgists': [EC_PLANETS, EC_PLANETS_JOBS, 'Metallurgists'],
    'planet_culture_workers': [EC_PLANETS, EC_PLANETS_JOBS, 'Culture Workers'],
    'planet_entertainers': [EC_PLANETS, EC_PLANETS_JOBS, 'Entertainers'],
    'planet_enforcers': [EC_PLANETS, EC_PLANETS_JOBS, 'Enforcers'],
    'planet_doctors': [EC_PLANETS, EC_PLANETS_JOBS, 'Doctors'],
    'planet_refiners': [EC_PLANETS, EC_PLANETS_JOBS, 'Refiners'],
    'planet_translucers': [EC_PLANETS, EC_PLANETS_JOBS, 'Translucers'],
    'planet_chemists': [EC_PLANETS, EC_PLANETS_JOBS, 'Chemists'],
    'planet_artisans': [EC_PLANETS, EC_PLANETS_JOBS, 'Artisans'],
    'pop_category_robot': [EC_PLANETS, EC_PLANET_POPS, 'Robots'],
    'pop_category_slaves': [EC_PLANETS, EC_PLANET_POPS, 'Slaves'],
    'pop_category_workers': [EC_PLANETS, EC_PLANET_POPS, 'Robots'],
    'pop_category_specialists': [EC_PLANETS, EC_PLANET_POPS, 'Robots'],
    'pop_category_rulers': [EC_PLANETS, EC_PLANET_POPS, 'Robots'],
    'planet_deposits': [EC_PLANETS, 'Other'],
    'orbital_mining_deposits': [EC_STATIONS],
    'orbital_research_deposits': [EC_STATIONS],
    'armies': [EC_ARMIES],
    'leader_admirals': [EC_LEADERS],
    'leader_generals': [EC_LEADERS],
    'leader_scientists': [EC_LEADERS],
    'leader_governors': [EC_LEADERS],
    'pop_factions': [EC_PLANETS, EC_PLANET_POPS, 'Factions'],
    'country_base': [EC_BASE]
}


def get_empires(state):
    return {
        cid: empire['name'] 
        for cid, empire in state['country'].items() if isinstance(empire, dict)
    }


def get_player_empire(state):
    players = state['player']
    if len(players) >= 1:
        return players[0]['country']
    return None


def build_snapshot(state, empire):
    if empire not in state['country']:
        print(f'Invalid empire: {empire}')

    planets, pops = _get_planets_and_pops(state, empire)
    snapshot = {
        'name': state['country'][empire]['name'],
        'date': state['date'],
        'date_components': _parse_date(state['date']),
        'active_empires': len(get_empires(state).keys()),
        'edict_count': len(state['country'][empire]['edicts']),
        'sprawl': state['country'][empire]['empire_size'],
        'leaders': _get_leaders(state, empire),
        'standing': _get_standing(state, empire),
        'war': _get_wars(state, empire),
        'systems': _get_systems(state, empire),
        'federation': _get_federation(state, empire),
        'unity': _get_unity(state, empire),
        'economy': _get_economy(state, empire),
        'construction': _get_construction(state, empire),
        'tech': _get_tech(state, empire),
        'planets': planets,
        'pops': pops,
        'fleets': _get_fleets(state, empire),
        'armies': _get_armies(state, empire)
    }
    return snapshot


def _basic_stats(values):
    return {
        'avg': sum(values) / len(values) if len(values) > 0 else 0,
        'min': min(values) if len(values) > 0 else 0,
        'max': max(values) if len(values) > 0 else 0,
        'total': sum(values) if len(values) > 0 else 0
    }


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
    upgraded = state['country'][empire]['num_upgraded_starbase']
    return {
        'surveyed_objects': len(surveyed_ids),
        'surveyed_systems': surveyed_stars,
        'owned': len(owned),
        'starbases': upgraded
    }


def _get_federation(state, empire):
    if 'federation' not in state['country'][empire] or not isinstance(state['country'][empire]['federation'], int):
        return {
            'name': '',
            'members': 0,
            'cohesion': 0,
            'xp': 0,
            'level': 0,
            'leader': False
        }
    federation = state['federation'][state['country'][empire]['federation']]
    return {
        'name': federation['name'],
        'members': len(federation['members']),
        'cohesion': federation['federation_progression']['cohesion'],
        'xp': federation['federation_progression']['experience'],
        'level': federation['federation_progression']['levels'],
        'leader': federation['leader'] == empire
    }


def _get_unity(state, empire):
    ap_count = len(state['country'][empire]['ascension_perks'])
    unity_income = sum([
        iset['unity'] for k, iset in state['country'][empire]['budget']['current_month']['income'].items()
        if 'unity' in iset
    ])
    adopted_trees = 0
    finished_trees = 0
    traditions = 0
    for trad in state['country'][empire]['traditions']:
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
        'acension_perks': ap_count,
        'unity': unity_income
    }


def _classify_resource_producer(name):
    if name in ECONOMY_CLASSES:
        return ECONOMY_CLASSES[name]
    
    if 'planet' in name:
        if 'district' in name:
            return [EC_PLANETS, EC_PLANETS_DISTRICTS]
        if 'pop' in name:
            return [EC_PLANETS, EC_PLANETS_POPS, name.split('_')[-1].capitalize()]
        return [EC_PLANETS, EC_PLANETS_JOBS, name.split('_')[-1].capitalize()]
    if 'orbital' in name:
        return [EC_STATIONS]
    if 'starbase' in name or 'station' in name:
        return [EC_SB, 'Other']
    if 'ship' in name:
        return [EC_SHIPS, 'Other']
    return ['Other (unknown)']


def _build_resource_breakdown(budget):
    breakdown = {}
    for producer, resources in budget.items():
        if not resources:
            continue
        classes = _classify_resource_producer(producer)
        for resource, amount in resources.items():
            if resource not in breakdown:
                breakdown[resource] = {
                    'total': amount,
                    'breakdown': {}
                }
            else:
                breakdown[resource]['total'] += amount
            rb = breakdown[resource]['breakdown']
            for class_name in classes:
                if class_name not in rb:
                    rb[class_name] = {
                        'total': amount,
                        'breakdown': {}
                    }
                else:
                    rb[class_name]['total'] += amount
                rb = rb[class_name]['breakdown']
    return breakdown


def _get_economy(state, empire):
    resources = state['country'][empire]['modules']['standard_economy_module']['resources']
    resource_names = [name for name in resources.keys()]
    budgets = state['country'][empire]['budget']['current_month']
    income = _build_resource_breakdown(budgets['income'])
    spending = _build_resource_breakdown(budgets['expenses'])
    nets = {}
    for resource in income.keys():
        net = income[resource]['total']
        if resource in spending:
            net -= spending[resource]['total']
        nets[resource] = net

    return {
        'stockpile': resources,
        'net_income': nets,
        'income': income,
        'spending': spending
    }


def _get_construction(state, empire):
    build_queues = [
        {**queue, 'id': qid} for qid, queue in state['construction']['queue_mgr']['queues'].items()
        if queue['owner'] == empire
    ]
    total_items = 0
    max_size = 0
    type_queues = {}
    for queue in build_queues:
        queue['size'] = sum([
            1 for iid,item in state['construction']['item_mgr']['items'].items()
            if isinstance(item, dict) and item['queue'] == queue['id']
        ])
        total_items += queue['size']
        if queue['size'] > max_size:
            max_size = queue['size']
        if queue['type'] not in type_queues:
            type_queues[queue['type']] = [queue]
        else:
            type_queues[queue['type']].append(queue)

    breakdown = {
        qtype: {
            'queue_count': len(qlist),
            'queued_items': sum([queue['size'] for queue in qlist]),
            'avg_queue_size': sum([queue['size'] for queue in qlist]) / len(qlist),
            'max_queue_size': max([queue['size'] for queue in qlist])
        } for qtype, qlist in type_queues.items()
    }
        
    return {
        'queue_count': len(build_queues), # TODO - consider taking into acccount simultaneous queues
        'queued_items': total_items,
        'avg_queue_size': total_items / len(build_queues),
        'max_queue_size': max_size,
        'breakdown': breakdown
    }


def _get_tech(state, empire):
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
    research['total'] = sum([amt for i, amt in research.items()])
    completed = len(state['country'][empire]['tech_status']['technology'])
    options = {
        stype: len(state['country'][empire]['tech_status']['alternatives'][stype])
        for stype in research.keys() if stype != 'total'
    }
    return {
        'output': research,
        'completed_techs': completed,
        'available_techs': options
    }


def _get_planets_and_pops(state, empire):
    planet_dict = {
        pid: planet for pid, planet in state['planets']['planet'].items()
        if isinstance(planet, dict) and 'owner' in planet and planet['owner'] == empire
    }
    planets = [planet for pid, planet in planet_dict.items()]
    now = _parse_date(state['date'])
    for planet in planets:
        days = _date_diff_days(now, _parse_date(planet['colonize_date']))
        planet['age_days'] = days
        planet['age'] = days / DAYS_PER_YEAR

    types = {
        planet['planet_class']: planet['planet_class'].split('_')[-1].capitalize()
        for planet in planets
    }
    type_sums = {}
    for planet in planets:
        tp = types[planet['planet_class']]
        if tp == 'Habitable':
            tp = 'Ring World Section'
        if tp not in type_sums:
            type_sums[tp] = 1
        else:
            type_sums[tp] += 1

    planet_stats = {
        'total': len(planets),
        'types': type_sums,
        'districts': _basic_stats([len(planet['district']) for planet in planets]),
        'buildings': _basic_stats([len(planet['buildings']) for planet in planets]),
        'sizes': _basic_stats([planet['planet_size'] for planet in planets]),
        'stability': _basic_stats([planet['stability'] for planet in planets]),
        'housing': _basic_stats([planet['free_housing'] for planet in planets]),
        'crime': _basic_stats([planet['crime'] for planet in planets]),
        'pops': _basic_stats([len(planet['pop']) for planet in planets]),
        'age_days': _basic_stats([planet['age_days'] for planet in planets]),
        'age': _basic_stats([planet['age'] for planet in planets])
    }

    pop_ids = []
    for planet in planets:
        pop_ids.extend(planet['pop'])
    pops = [state['pop'][pid] for pid in pop_ids if isinstance(state['pop'][pid], dict)]
    jobs = {
        pop['job']: ' '.join(word.capitalize() for word in pop['job'].split('_'))
        for pop in pops
    }

    species_sums = {}
    job_sums = {}
    for pop in pops:
        species = state['species'][pop['species_index']]['name'] \
            if pop['species_index'] < len(state['species']) else 'Unknown'
        if species not in species_sums:
            species_sums[species] = 1
        else:
            species_sums[species] += 1
        
        job = jobs[pop['job']]
        if job not in job_sums:
            job_sums[job] = 1
        else:
            job_sums[job] += 1

    pop_stats = {
        'total': len(pops),
        'jobs': job_sums,
        'species': species_sums
    }

    return planet_stats, pop_stats


def _is_transport_fleet(state, fleet):
    for ship_id in fleet['ships']:
        if ship_id not in state['ships']:
            continue
        if 'army' in state['ships'][ship_id]:
            return True
    return False


def _get_fleets(state, empire):
    fleets = [
        fleet for fid, fleet in state['fleet'].items()
        if isinstance(fleet, dict) and
           fleet['owner'] == empire and
           ('civilian' not in fleet or fleet['civilian'] == 'no') and
           ('station' not in fleet or fleet['station'] == 'no') and
           not _is_transport_fleet(state, fleet)
    ]

    power = _basic_stats([fleet['military_power'] for fleet in fleets if fleet['military_power'] > 0])
    ships = _basic_stats([len(fleet['ships']) for fleet in fleets])
    ship_types = {}
    ship_exp = 0
    for fleet in fleets:
        for ship_id in fleet['ships']:
            stype = 'Unknown'
            if ship_id in state['ships']:
                ship = state['ships'][ship_id]
                ship_exp += ship['experience'] if 'experience' in ship else 0
                if ship['ship_design'] in state['ship_design']:
                    design = state['ship_design'][ship['ship_design']]
                    stype = design['ship_size'].capitalize()
                    if stype not in ship_types:
                        ship_types[stype] = 1
                    else:
                        ship_types[stype] += 1
    return {
        'total': len(fleets),
        'fleet_power': power,
        'ships': ships,
        'ship_types': ship_types,
        'avg_ship_exp': ship_exp / ships['total']
    }


def _get_armies(state, empire):
    armies = [
        army for aid, army in state['army'].items()
        if isinstance(army, dict) and army['owner'] == empire
    ]
    type_counts = {}
    for army in armies:
        atype = ' '.join([word.capitalize() for word in army['type'].split('_')])
        if atype not in type_counts:
            type_counts[atype] = 1
        else:
            type_counts[atype] += 1
    return {
        'total': len(armies),
        'types': type_counts
    }
