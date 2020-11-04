import traceback

from engine import parser
from engine import extraction


def _build_empire_snapshot(state, empire):
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


def build_snapshot(watcher):
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
    _add_comparisons(state, snapshot['empires'])
    return snapshot