from . import util
    

def empire_valid(state, empire):
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

    return {
        'name': data['name'],
        'player_name': player_name,
        'edict_count': len(data['edicts'] if 'edicts' in data else []),
        'sprawl': data['empire_size'] if 'empire_size' in data else 0,
        'leader_ids': data['owned_leaders']
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
