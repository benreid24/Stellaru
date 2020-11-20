from engine.extraction import isolation_layer as extractor_isolation_layer
from engine.extraction.util import date_days, DAYS_PER_YEAR, construct_date

import traceback

TREATY_LENGTH_YEARS = 10


def get_known_empires(state, empire):
    try:
        relations = []
        for relation in state['country'][empire]['relations_manager']['relation']:
            if 'contact' in relation and relation['contact'] == 'yes':
                relations.append(relation['country'])
        return relations
    except:
        traceback.print_exc()
        return []


def get_empire_name(state, empire, other_empire):
    if other_empire in get_known_empires(state, empire):
        return state['country'][other_empire]['name']
    return None


def get_system_name(state, system_id):
    try:
        return state['galactic_object'][system_id]['name']
    except:
        return 'Unknown System'


def get_wars(state):
    def _make_participant_list(plist):
        return {
            participant['country']: 'Main' if participant['call_type'] == 'primary' else 'Ally'
            for participant in plist
        } 

    def _make_battle_list(battles):
        try:
            return [{
                'attackers': battle['attackers'],
                'defenders': battle['defenders'],
                'location': get_system_name(state, battle['system']),
                'date': battle['date'],
                'date_days': date_days(battle['date']),
                'attacker_losses': battle['attacker_losses'],
                'defender_losses': battle['defender_losses'],
                'victor': 'attacker' if battle['attacker_victory'] == 'yes' else 'defender'
            } for battle in battles]
        except:
            traceback.print_exc()
            return []

    wars = []
    for wid, war in state['war'].items():
        try:
            wars.append({
                'id': wid,
                'name': war['name'],
                'start_date': war['start_date'],
                'start_date_days': date_days(war['start_date']),
                'attackers': _make_participant_list(war['attackers']),
                'defenders': _make_participant_list(war['defenders']),
                'battles': _make_battle_list(war['battles']) if 'battles' in war else []
            })
        except:
            continue
    return wars


def get_treaties(state):
    treaties = []
    for tid, treaty in state['truce'].items():
        if not isinstance(treaty, dict):
            continue
        try:
            start_days = date_days(treaty['start_date'])
            end_days = date_days(treaty['start_date']) + TREATY_LENGTH_YEARS * DAYS_PER_YEAR

            rmap = {}
            for cid, country in state['country'].items():
                if 'relations_manager' not in country or 'relation' not in country['relations_manager']:
                    continue
                for relation in country['relations_manager']['relation']:
                    if 'truce' not in relation or relation['truce'] != tid:
                        continue

                    if cid not in rmap:
                        rmap[cid] = [relation['country']]
                    else:
                        rmap[cid].append(relation['country'])

            attackers = []
            defenders = []
            for cid, enemies in rmap.items():
                if cid in attackers:
                    defenders.extend(enemies)
                elif cid in defenders:
                    attackers.extend(enemies)
                else:
                    attackers.append(cid)
                    defenders.extend(enemies)

            treaties.append({
                'id': tid,
                'war_name': treaty['name'],
                'attackers': attackers,
                'defenders': defenders,
                'start_date': treaty['start_date'],
                'start_date_days': start_days,
                'end_date_days': end_days,
                'end_date': construct_date(end_days)
            })
        except:
            traceback.print_exc()
            continue
    return treaties


def get_relations(state, empire):
    def _get_bool(obj, key, value, default_value):
        return obj[key] == value if key in obj else default_value

    def _rivaled(state, empire, other):
        try:
            for relation in state['country'][other]['relations_manager']['relation']:
                if relation['country'] != empire:
                    continue
                return _get_bool(relation, 'is_rival', 'yes', False)
        except:
            pass
        return False

    relations = {}
    try:
        for relation in state['country'][empire]['relations_manager']['relation']:
            try:
                if relation['contact'] != 'yes':
                    continue
                relations[relation['country']] = {
                    'score': relation['relation_current'] if 'relation_current' in relation else 0,
                    'open_borders': _get_bool(relation, 'closed_borders', 'no', True),
                    'research_agreement': _get_bool(relation, 'research_agreement', 'yes', False),
                    'commercial_pact': _get_bool(relation, 'commercial_pact', 'yes', False),
                    'migration_treaty': _get_bool(relation, 'migration_access', 'yes', False),
                    'alliance': _get_bool(relation, 'alliance', 'yes', False),
                    'rival': _get_bool(relation, 'is_rival', 'yes', False),
                    'rivaled': _rivaled(state, empire, relation['country']),
                    'trust': relation['trust'] if 'trust' in relation else 0,
                }
            except:
                continue
    except:
        pass
    return relations


def get_federations(state):
    try:
        feds = {}
        for fid, federation in state['federation'].items():
            if not isinstance(federation, dict):
                continue
            try:
                feds[fid] = {
                    'name': federation['name'],
                    'members': federation['members'],
                    'start_date': date_days(federation['start_date']),
                    'leader': federation['leader']
                }
            except:
                continue
        return feds
    except:
        return {}
