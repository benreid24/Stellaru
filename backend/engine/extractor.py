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
    return snapshot
