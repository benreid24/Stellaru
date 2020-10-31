import traceback

from engine import parser

from engine import extraction

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
    'planet_buildings': [EC_PLANETS_BUILDINGS],
    'planet_buildings_strongholds': [EC_PLANETS_BUILDINGS],
    'planet_districts': [EC_PLANETS_DISTRICTS],
    'planet_districts_cities': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_energy': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_research': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_mining': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_trade': [EC_PLANETS_DISTRICTS],
    'planet_pop_assemblers': [EC_PLANETS_JOBS, 'Assemblers'],
    'planet_farmers': [EC_PLANETS_JOBS, 'Farmers'],
    'planet_miners': [EC_PLANETS_JOBS, 'Miners'],
    'planet_technician': [EC_PLANETS_JOBS, 'Technicians'],
    'planet_administrators': [EC_PLANETS_JOBS, 'Administrators'],
    'planet_bureaucrats': [EC_PLANETS_JOBS, 'Bureaucrats'],
    'planet_researchers': [EC_PLANETS_JOBS, 'Researchers'],
    'planet_metallurgists': [EC_PLANETS_JOBS, 'Metallurgists'],
    'planet_culture_workers': [EC_PLANETS_JOBS, 'Culture Workers'],
    'planet_entertainers': [EC_PLANETS_JOBS, 'Entertainers'],
    'planet_enforcers': [EC_PLANETS_JOBS, 'Enforcers'],
    'planet_doctors': [EC_PLANETS_JOBS, 'Doctors'],
    'planet_refiners': [EC_PLANETS_JOBS, 'Refiners'],
    'planet_translucers': [EC_PLANETS_JOBS, 'Translucers'],
    'planet_chemists': [EC_PLANETS_JOBS, 'Chemists'],
    'planet_artisans': [EC_PLANETS_JOBS, 'Artisans'],
    'pop_category_robot': [EC_PLANET_POPS, 'Robots'],
    'pop_category_slaves': [EC_PLANET_POPS, 'Slaves'],
    'pop_category_workers': [EC_PLANET_POPS, 'Workers'],
    'pop_category_specialists': [EC_PLANET_POPS, 'Specialists'],
    'pop_category_rulers': [EC_PLANET_POPS, 'Rulers'],
    'planet_deposits': ['Other'],
    'orbital_mining_deposits': [EC_STATIONS],
    'orbital_research_deposits': [EC_STATIONS],
    'armies': [EC_ARMIES],
    'leader_admirals': [EC_LEADERS],
    'leader_generals': [EC_LEADERS],
    'leader_scientists': [EC_LEADERS],
    'leader_governors': [EC_LEADERS],
    'pop_factions': [EC_PLANET_POPS, 'Factions'],
    'country_base': [EC_BASE]
}

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

MARKET_RESOURCES = [resource for resource, p in BASE_PRICES.items()]


def _key_or(obj, key, alt):
    return obj[key] if key in obj else alt


def _empire_valid(state, empire):
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
        cid: empire['name'] 
        for cid, empire in state['country'].items() if isinstance(empire, dict) and _empire_valid(state, cid)
    }


def get_player_name(state, empire):
    players = {}
    if 'player' in state:
        players = {player['country']: player['name'] for player in state['player']}
    if empire in players:
        return players[empire] if players[empire] != 'unknown' else 'Player'
    return 'AI'


def _build_new_snapshot(state, empire):
    snap = {}
    try:
        for extractor in extraction.extractor_list:
            if not extractor.data_key():
                snap = {**snap, **extractor.extract_data(state, empire)}
            else:
                snap[extractor.data_key()] = extractor.extract_data(state, empire)
    except:
        print(traceback.format_exc())
    return snap


def _build_empire_snapshot(state, empire):
    if empire not in state['country']:
        print(f'Invalid empire: {empire}')

    try:
        snap = {}
        for extractor in extraction.extractor_list:
            if not extractor.data_key():
                snap = {**snap, **extractor.extract_data(state, empire)}
            else:
                snap[extractor.data_key()] = extractor.extract_data(state, empire)
    except:
        print(traceback.format_exc())

    try:
        planets, pops = _get_planets_and_pops(state, empire)
        snapshot = {
            'name': state['country'][empire]['name'],
            'player_name': get_player_name(state, empire),
            'date': state['date'],
            'date_components': parse_date(state['date']),
            'date_days': date_days(state['date']),
            'active_empires': len(get_empires(state).keys()),
            'edict_count': _get_edicts(state, empire),
            'sprawl': _get_empire_size(state, empire),
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
    except Exception as err:
        print(traceback.format_exc())
    return snapshot


def _add_comparisons(state, empire_snaps):
    names = {}
    for eid, empire in empire_snaps.items():
        try:
            if not _empire_valid(state, eid):
                continue
            names[eid] = empire['name']
            eco_comp = {eid: empire['economy']['base_gdp']['total_inflows']}
            sci_comp = {eid: empire['tech']['output']['total']}
            vp_comp = {eid: sum([v for t, v in empire['standing']['victory_points'].items()])}
            str_comp = {}
            fleet_strength = empire['fleets']['fleet_power']['total']
            for oid, oempire in empire_snaps.items():
                try:
                    if oid == eid or not _empire_valid(state, oid):
                        continue
                    eco_comp[oid] = oempire['economy']['base_gdp']['total_inflows']
                    sci_comp[oid] = oempire['tech']['output']['total']
                    vp_comp[oid] = sum([v for t, v in oempire['standing']['victory_points'].items()])
                    estr = oempire['fleets']['fleet_power']['total']
                    str_comp[oid] = estr / fleet_strength * 100
                except:
                    continue
            empire['comparisons'] = {
                'names': names,
                'economy': eco_comp,
                'tech': sci_comp,
                'victory_points': vp_comp,
                'military': str_comp
            }
        except:
            continue


def build_snapshot(state):
    empires = get_empires(state)
    snapshot = {
        'date': state['date'],
        'date_components': parse_date(state['date']),
        'date_days': date_days(state['date']),
        'empires': {
            empire_id: _build_empire_snapshot(state, empire_id)
            for empire_id in empires
        }
    }
    _add_comparisons(state, snapshot['empires'])
    return snapshot


def build_snapshot_from_watcher(watcher):
    meta, state = parser.parse_save(watcher.get_file(True))
    return build_snapshot(state)


def _basic_stats(values):
    return {
        'avg': sum(values) / len(values) if len(values) > 0 else 0,
        'min': min(values) if len(values) > 0 else 0,
        'max': max(values) if len(values) > 0 else 0,
        'total': sum(values) if len(values) > 0 else 0
    }


def parse_date(date_str):
    comps = date_str.split('.')
    if len(comps) != 3:
        return {'y': 0, 'm': 0, 'd': 0}
    return {
        'y': int(comps[0]),
        'm': int(comps[1]),
        'd': int(comps[2])
    }


def date_days(date_str):
    comps = parse_date(date_str)
    return comps['y'] * DAYS_PER_YEAR + comps['m'] * DAYS_PER_MONTH + comps['d']


def _date_diff_days(future, past):
    year_diff = future['y'] - past['y']
    month_diff = future['m'] + (12 - past['m'])
    day_diff = future['d'] + (DAYS_PER_MONTH - past['d'])
    return year_diff * DAYS_PER_YEAR + month_diff * DAYS_PER_MONTH + day_diff


def _get_edicts(state, empire):
    try:
        return len(state['country'][empire]['edicts'])
    except:
        return 0


def _get_empire_size(state, empire):
    try:
        return state['country'][empire]['empire_size']
    except:
        return 0


def _get_leaders(state, empire):
    try:
        date = parse_date(state['date'])
        leader_ids = state['country'][empire]['owned_leaders']
        leader_pool = state['leaders']
        leaders = [leader_pool[lid] for lid in leader_ids if lid in leader_pool]
        classes = set([leader['class'] for leader in leaders])
        leaders = [
            {
                **leader,
                'actual_age': leader['age'] + _date_diff_days(date, parse_date(leader['date'])) / DAYS_PER_YEAR
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
            'percent_male': sum([1 for leader in leaders if 'gender' in leader and leader['gender'] == 'male']) / len(leaders)
        }
        return {**breakdown, **leader_info}
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_victory_points(state, empire, ignore_fed=False):
    try:
        crisis_kills = state['country'][empire]['crisis_kills'] if 'crisis_kills' in state['country'][empire] else 0
        
        relic_points = 0
        if 'relics' in state['country'][empire]:
            for relic in state['country'][empire]['relics']:
                if relic in RELIC_SCORES:
                    relic_points += RELIC_SCORES[relic]
                else:
                    print(f'Relic {relic} not configured in RELIC_SCORES')

        planet_count = len(state['country'][empire]['owned_planets']) if 'owned_planets' in state['country'][empire] else 0
        system_count = len(
            [base for bid, base in state['starbase_mgr']['starbases'].items()
            if isinstance(base, dict) and base['owner'] == empire]
        )
        planets, pops = _get_planets_and_pops(state, empire)
        pop_count = pops['total'] if 'total' in pops else 0

        subject_score = 0
        if 'subjects' in state['country'][empire]:
            for subject in state['country'][empire]['subjects']:
                if subject != empire:
                    vps = _get_victory_points(state, subject, True)
                    for k, score in vps.items():
                        subject_score += score * 0.5

        federation_score = 0
        if 'federation' in state['country'][empire] and not ignore_fed:
            if state['country'][empire]['federation'] in state['federation']:
                federation = state['federation'][state['country'][empire]['federation']]
                for member in federation['members']:
                    if member != empire:
                        vps = _get_victory_points(state, member, True)
                        for k, score in vps.items():
                            federation_score += score * 0.1

        return {
            'Economy': state['country'][empire]['economy_power'],
            'Technology': state['country'][empire]['tech_power'] / 4,
            'Systems': system_count * 10,
            'Colonies': planet_count * 50,
            'Pops': pop_count * 2,
            'Subjects': subject_score,
            'Federation': federation_score,
            'Crisis Ships Killed': crisis_kills * 10,
            'Relics': relic_points
        }
    except:
        print(traceback.print_exc())
        return {}


def _get_standing(state, empire):
    try:
        return {
            'victory_rank': state['country'][empire]['victory_rank'],
            'victory_points': _get_victory_points(state, empire)
        }
    except Exception as err:
        print(traceback.format_exc())
        return {
            'victory_rank': 0,
            'tech_power': 0,
            'economy_power': 0,
            'military_power': 0
        }


def _get_wars(state, empire):
    try:
        active_wars = [
            war for key, war in state['war'].items()
            if isinstance(war, dict)
        ] if isinstance(state['war'], dict) else []

        attackers = [fighter['country'] for war in active_wars for fighter in war['attackers']]
        defenders = [fighter['country'] for war in active_wars for fighter in war['defenders']]
        
        offense_wars = sum([1 for war in active_wars if empire in attackers])
        defense_wars = sum([1 for war in active_wars if empire in defenders])

        all_participants = attackers
        all_participants.extend(defenders)
        all_participants = set(all_participants)

        return {
            'total': len(active_wars),
            'all_participants': len(all_participants),
            'participation': offense_wars + defense_wars,
            'attacker': offense_wars,
            'defender': defense_wars
        }
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_systems(state, empire):
    try:
        surveyed_ids = _key_or(state['country'][empire], 'surveyed', [])
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
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_federation(state, empire):
    try:
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
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_unity(state, empire):
    try:
        ap_count = len(_key_or(state['country'][empire], 'ascension_perks', []))
        unity_income = sum([
            iset['unity'] for k, iset in state['country'][empire]['budget']['current_month']['income'].items()
            if 'unity' in iset
        ])
        adopted_trees = 0
        finished_trees = 0
        traditions = 0
        for trad in _key_or(state['country'][empire], 'traditions', []):
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
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _classify_resource_producer(name):
    if name in ECONOMY_CLASSES:
        return ECONOMY_CLASSES[name]
    
    if 'planet' in name:
        if 'district' in name:
            return [EC_PLANETS_DISTRICTS]
        if 'pop' in name:
            return [EC_PLANETS_POPS, name.split('_')[-1].capitalize()]
        return [EC_PLANETS_JOBS, name.split('_')[-1].capitalize()]
    if 'orbital' in name:
        return [EC_STATIONS]
    if 'starbase' in name or 'station' in name:
        return [EC_SB, 'Other']
    if 'ship' in name:
        return [EC_SHIPS, 'Other']
    return [' '.join([word.capitalize() for word in name.split('_')])]


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


def _get_market_prices(state, empire):
    try:
        global_index = None
        if 'galactic_market_access' in state['market'] and empire in state['market']['id']:
            global_index = state['market']['id'].index(empire)
        index = state['market']['internal_market_fluctuations']['country'].index(empire)
        prices = {}
        for resource in MARKET_RESOURCES:
            fluctuation = 0
            if resource in state['market']['internal_market_fluctuations']['resources'][index]:
                fluctuation += state['market']['internal_market_fluctuations']['resources'][index][resource]
            if global_index:
                if state['market']['galactic_market_access'][global_index] > 0:
                    if 'fluctuations' in state['market']:
                        fluctuation += state['market']['fluctuations'][RESOURCE_INDICES[resource]]
            prices[resource] = BASE_PRICES[resource] + fluctuation * BASE_PRICES[resource] / 100
        return prices
    except:
        name = state['country'][empire]['name']
        print(f'Warning: Failed to get market prices for {empire} ({name}), using base prices')
        return BASE_PRICES


def _get_gdp(income, spending, net, stockpile, prices):
    gross_income = {}
    gross_spending = {}
    net_gdp = {}
    stockpile_value = {}
    for resource in MARKET_RESOURCES:
        i = income[resource]['total'] if resource in income else 0
        gross_income[resource] = prices[resource] * i
        s = spending[resource]['total'] if resource in spending else 0
        gross_spending[resource] = prices[resource] * s
        n = net[resource] if resource in net else 0
        net_gdp[resource] = prices[resource] * n
        v = stockpile[resource] if resource in stockpile else 0
        stockpile_value[resource] = v * prices[resource]

    energy_in = income['energy']['total'] if 'energy' in income else 0
    energy_out = spending['energy']['total'] if 'energy' in spending else 0
    energy_net = net['energy'] if 'energy' in net else 0
    energy_stockpile = stockpile['energy'] if 'energy' in stockpile else 0
    
    return {
        'inflows': gross_income,
        'outflows': gross_spending,
        'net': net_gdp,
        'stockpile_values': stockpile_value,
        'total_inflows': sum([val for r, val in gross_income.items()]) + energy_in,
        'total_outflows': sum([val for r, val in gross_spending.items()]) + energy_out,
        'total_net': sum([val for r, val in net_gdp.items()]) + energy_net,
        'total_stockpile_value': sum([v for r, v in stockpile_value.items()]) + energy_stockpile
    }


def _get_economy(state, empire):
    try:
        if 'standard_economy_module' not in state['country'][empire]['modules']:
            return {}
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

        market_prices = _get_market_prices(state, empire)
        base_gdp = _get_gdp(income, spending, nets, resources, BASE_PRICES)
        adjusted_gdp = _get_gdp(income, spending, nets, resources, market_prices)

        return {
            'stockpile': resources,
            'net_income': nets,
            'income': income,
            'spending': spending,
            'market_prices': market_prices,
            'base_gdp': base_gdp,
            'adjusted_gdp': adjusted_gdp
        }
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_construction(state, empire):
    try:
        build_queues = [
            {**queue, 'id': qid} for qid, queue in state['construction']['queue_mgr']['queues'].items()
            if isinstance(queue, dict) and queue['owner'] == empire
        ]
        total_count = 0
        total_items = 0
        max_size = 0
        type_count = {}
        type_queues = {}
        for queue in build_queues:
            queue['size'] = sum([
                1 for iid,item in state['construction']['item_mgr']['items'].items()
                if isinstance(item, dict) and item['queue'] == queue['id']
            ])
            total_count += queue['simultaneous']
            total_items += queue['size']
            if queue['size'] > max_size:
                max_size = queue['size']
            if queue['type'] not in type_queues:
                type_count[queue['type']] = queue['simultaneous']
                type_queues[queue['type']] = [queue]
            else:
                type_count[queue['type']] += queue['simultaneous']
                type_queues[queue['type']].append(queue)

        breakdown = {
            qtype: {
                'queue_count': type_count[qtype],
                'queued_items': sum([queue['size'] for queue in qlist]),
                'avg_queue_size': sum([queue['size'] for queue in qlist]) / len(qlist) if len(qlist) > 0 else 0,
                'max_queue_size': max([queue['size'] for queue in qlist])
            } for qtype, qlist in type_queues.items()
        }
            
        return {
            'queue_count': total_count,
            'queued_items': total_items,
            'avg_queue_size': total_items / len(build_queues) if len(build_queues) > 0 else 0,
            'max_queue_size': max_size,
            'breakdown': breakdown
        }
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_tech(state, empire):
    try:
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
        completed = len(_key_or(state['country'][empire]['tech_status'], 'technology', []))
        options = {
            stype: len(state['country'][empire]['tech_status']['alternatives'][stype])
            for stype in research.keys() if stype != 'total'
        }
        return {
            'output': research,
            'completed_techs': completed,
            'available_techs': options
        }
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_planets_and_pops(state, empire):
    try:
        planet_dict = {
            pid: planet for pid, planet in state['planets']['planet'].items()
            if isinstance(planet, dict) and 'owner' in planet and planet['owner'] == empire
        }
        planets = [{'id': pid, **planet} for pid, planet in planet_dict.items()]
        now = parse_date(state['date'])
        for planet in planets:
            days = _date_diff_days(
                now,
                parse_date(planet['colonize_date']) if 'colonize_date' in planet else START_DATE
            )
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

        planet_summaries = {
            planet['id']: {
                'name': planet['name'],
                'size': planet['planet_size'],
                'population': len(planet['pop']) if 'pop' in planet else 0,
                'districts': len(planet['district']) if 'district' in planet else 0,
                'armies': len(planet['army']) if 'army' in planet else 0,
                'stability': planet['stability'],
                'amenities': planet['amenities'],
                'free_amenities': planet['free_amenities'],
                'amenities_usage': planet['amenities_usage'],
                'free_housing': planet['free_housing'],
                'total_housing': planet['total_housing']
            } for planet in planets
        }

        planet_stats = {
            'total': len(planets),
            'list': planet_summaries,
            'types': type_sums,
            'districts': _basic_stats([len(_key_or(planet, 'district', [])) for planet in planets]),
            'buildings': _basic_stats([len(planet['buildings']) for planet in planets]),
            'sizes': _basic_stats([planet['planet_size'] for planet in planets]),
            'stability': _basic_stats([planet['stability'] for planet in planets]),
            'amenities': _basic_stats([planet['free_amenities'] for planet in planets]),
            'housing': _basic_stats([planet['free_housing'] for planet in planets]),
            'crime': _basic_stats([planet['crime'] for planet in planets]),
            'pops': _basic_stats([len(_key_or(planet, 'pop', [])) for planet in planets]),
            'age_days': _basic_stats([planet['age_days'] for planet in planets]),
            'age': _basic_stats([planet['age'] for planet in planets])
        }

        pop_ids = []
        for planet in planets:
            pop_ids.extend(_key_or(planet, 'pop', []))
        pops = [state['pop'][pid] for pid in pop_ids if isinstance(state['pop'][pid], dict)]
        jobs = {
            pop['job']: ' '.join(word.capitalize() for word in pop['job'].split('_'))
            for pop in pops if 'job' in pop
        }

        species_sums = {}
        job_sums = {}
        ethic_sums = {}
        cat_sums = {}
        for pop in pops:
            species = state['species'][pop['species_index']]['name'] \
                if pop['species_index'] < len(state['species']) else 'Unknown'
            if species not in species_sums:
                species_sums[species] = 1
            else:
                species_sums[species] += 1
            
            if 'job' in pop:
                job = jobs[pop['job']]
                if job not in job_sums:
                    job_sums[job] = 1
                else:
                    job_sums[job] += 1

            if 'category' in pop:
                cat = pop['category']
                if cat not in cat_sums:
                    cat_sums[cat] = 1
                else:
                    cat_sums[cat] += 1

            if 'ethos' in pop:
                for _, ethic_key in pop['ethos'].items():
                    ethic = ethic_key.split('_')[-1].capitalize()
                    if ethic not in ethic_sums:
                        ethic_sums[ethic] = 1
                    else:
                        ethic_sums[ethic] += 1

        pop_stats = {
            'total': len(pops),
            'jobs': job_sums,
            'species': species_sums,
            'categories': cat_sums,
            'ethics': ethic_sums
        }

        return planet_stats, pop_stats

    except Exception as err:
        print(traceback.format_exc())
        return {}, {}


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


def _get_fleets(state, empire):
    try:
        fleets = [
            {'id': fid, **fleet} for fid, fleet in state['fleet'].items()
            if isinstance(fleet, dict) and
            'owner' in fleet and
            fleet['owner'] == empire and
            ('civilian' not in fleet or fleet['civilian'] == 'no') and
            ('station' not in fleet or fleet['station'] == 'no') and
            not _is_transport_fleet(state, fleet)
        ]

        power = _basic_stats([fleet['military_power'] for fleet in fleets if fleet['military_power'] > 0])
        ships = _basic_stats([len(fleet['ships']) for fleet in fleets if 'ships' in fleet])
        ship_types = {}
        ship_exp = 0
        fleet_list = {}
        for fleet in fleets:
            if 'ships' in fleet:
                fleet_item = {
                    'id': fleet['id'],
                    'power': fleet['military_power'],
                    'ship_count': len(fleet['ships']),
                }
                exps = []
                for ship_id in fleet['ships']:
                    stype = 'Unknown'
                    if ship_id in state['ships']:
                        ship = state['ships'][ship_id]
                        ship_exp += ship['experience'] if 'experience' in ship else 0
                        exps.append(ship_exp)
                        if ship['ship_design'] in state['ship_design']:
                            design = state['ship_design'][ship['ship_design']]
                            stype = design['ship_size'].capitalize()
                            if stype not in ship_types:
                                ship_types[stype] = 1
                            else:
                                ship_types[stype] += 1
                fleet_item['experience'] = _basic_stats(exps)
                fleet_list[fleet['id']] = fleet_item
        
        return {
            'total': len(fleets),
            'fleet_power': power,
            'ships': ships,
            'ship_types': ship_types,
            'avg_ship_exp': ship_exp / ships['total'] if ships['total'] > 0 else 0,
            'fleets': fleet_list
        }
    except Exception as err:
        print(traceback.format_exc())
        return {}


def _get_armies(state, empire):
    try:
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
    except Exception as err:
        print(traceback.format_exc())
        return {}
