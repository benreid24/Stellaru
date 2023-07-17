from .isolation import v1, v2

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
    'sr_dark_matter': 20,
    'nanites': 20
}

MARKET_RESOURCES = [resource for resource, p in BASE_PRICES.items()]


def _try_versions(fn, state, *args):
    if 'version' in state and 'v2.' in state['version']:
        return getattr(v1, fn)(state, *args)
    else:
        return getattr(v2, fn)(state, *args)


def empire_valid(state, empire):
    return _try_versions('empire_valid', state, empire)


def get_empires(state):
    return _try_versions('get_empires', state)


def get_metadata(state):
    return _try_versions('get_metadata', state)


def get_empire(state, empire):
    return _try_versions('get_empire', state, empire)


def get_leaders(state, leader_ids):
    return _try_versions('get_leaders', state, leader_ids)


def get_planets(state, empire):
    return _try_versions('get_planets', state, empire)


def get_pops(state, pop_ids):
    return _try_versions('get_pops', state, pop_ids)


def get_federation(state, fed):
    return _try_versions('get_federation', state, fed)


def get_federations(state):
    return _try_versions('get_federations', state)


def get_wars(state):
    return _try_versions('get_wars', state)


def get_surveyed_objects(state, empire):
    return _try_versions('get_surveyed_objects', state, empire)


def get_unity(state, empire):
    return _try_versions('get_unity', state, empire)


def get_economy(state, empire):
    return _try_versions('get_economy', state, empire)


def get_market_prices(state, empire):
    return _try_versions('get_market_prices', state, empire)


def get_build_queues(state, empire):
    return _try_versions('get_build_queues', state, empire)


def get_tech(state, empire):
    return _try_versions('get_tech', state, empire)


def get_fleets(state, empire):
    return _try_versions('get_fleets', state, empire)


def get_armies(state, empire):
    return _try_versions('get_armies', state, empire)
