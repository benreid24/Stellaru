from .isolation import VERSIONS


def _try_versions(fn, *args):
    for v in VERSIONS:
        try:
            return getattr(v, fn)(*args)
        except AttributeError:
            raise Exception(f'Invalid isolation method: {fn}')
        except Exception:
            continue
    raise Exception(f'No valid version loader for method: {fn}')


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
    return _try_versions(state, pop_ids)


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
