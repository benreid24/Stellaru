import traceback

from engine import parser
from engine import extraction
from engine.extraction.postprocessors.postprocessor_data import PostprocessorData


def _build_empire_snapshot(state, empire):
    snap = {}

    def add_data(snap, extractor, data):
        if not extractor.data_key():
            snap.update(data)
        else:
            snap[extractor.data_key()] = data

    for extractor in extraction.extractor_list:
        try:
            add_data(snap, extractor, extractor.extract_data(state, empire))
        except:
            print(f'Extractor {type(extractor).__name__} failed to run')
            print(traceback.format_exc())
            add_data(snap, extractor, extractor.make_default(state, empire))
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


def build_snapshot_from_loaded(state, history=[]):
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
    return snapshot


def build_snapshot(watcher, history=[]):
    meta, state = parser.parse_save(watcher.get_file(True))
    return build_snapshot_from_loaded(state, history)
