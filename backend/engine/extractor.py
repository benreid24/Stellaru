import traceback

from engine import parser
from engine import extraction
from engine.extraction.postprocessors.postprocessor_data import PostprocessorData


def _build_empire_snapshot(state, empire):
    snap = {}
    for extractor in extraction.extractor_list:
        try:
            if not extractor.data_key():
                snap = {**snap, **extractor.extract_data(state, empire)}
            else:
                snap[extractor.data_key()] = extractor.extract_data(state, empire)
        except:
            print(traceback.format_exc())
    return snap


def _postprocess(snapshot, history, state):
    data = PostprocessorData(state, snapshot, history)
    for empire in snapshot['empires'].keys():
        data.setup_empire(empire)
        for processor in extraction.postprocessor_list:
            try:
                data.setup_postprocessor(processor.name())
                processor.postprocess(data)
            except:
                print(f'Postprocessor {processor.name()} failed to run')
                traceback.print_exc()


def _summarize_empire(empire_id, empire_snapshot):
    return {
        'id': empire_id,
        'name': empire_snapshot['name'],
        'player_name': empire_snapshot['player_name'],
        'sprawl': empire_snapshot['sprawl'],
        'victory_points': empire_snapshot['standing']['victory_points'],
        'system_count': empire_snapshot['systems']['owned'],
        'starbase_count': empire_snapshot['systems']['starbases'],
        'gdp': {
            'base': empire_snapshot['economy']['base_gdp'],
            'adjusted': empire_snapshot['economy']['adjusted_gdp']
        },
        'tech': empire_snapshot['tech']['output'],
        'planets': {
            'count': empire_snapshot['planets']['total'],
            'total_size': empire_snapshot['planets']['sizes']['total'],
            'building_count': empire_snapshot['planets']['buildings']['total'],
            'district_count': empire_snapshot['planets']['districts']['total'],
            'avg_amenities': empire_snapshot['planets']['amenities']['avg'],
            'avg_crime': empire_snapshot['planets']['crime']['avg'],
            'avg_stability': empire_snapshot['planets']['stability']['avg']
        },
        'pop_count': empire_snapshot['pops']['total'],
        'fleets': {
            'total_strength': empire_snapshot['fleets']['fleet_power']['total'],
            'ship_count': empire_snapshot['fleets']['ships']['total'],
            'avg_ship_exp': empire_snapshot['fleets']['avg_ship_exp']
        },
        'army_count': empire_snapshot['armies']['total']
    }


def build_snapshot(watcher, history=[]):
    meta, state = parser.parse_save(watcher.get_file(True))
    snapshot = {
        'date': state['date'],
        'date_components': extraction.util.parse_date(state['date']),
        'date_days': extraction.util.date_days(state['date']),
        'empires': {
            empire_id: _build_empire_snapshot(state, empire_id)
            for empire_id in extraction.get_empires(state)
        }
    }
    _postprocess(snapshot, history, state)
    snapshot['common'] = {
        'summaries': {
            empire_id: _summarize_empire(empire_id, empire_snapshot)
            for empire_id, empire_snapshot in snapshot['empires'].items()
        }
    }
    return snapshot
