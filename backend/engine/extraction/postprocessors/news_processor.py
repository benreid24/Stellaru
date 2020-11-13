import traceback

from .postprocessor import PostProcessor
from .postprocessor_data import PostprocessorData
from . import news


class NewsProcessor(PostProcessor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def postprocess(self, data: PostprocessorData):
        events = {}
        for generator in news.generator_list:
            try:
                if generator.name() not in data.get_processor_data():
                    data.get_processor_data()[generator.name()] = {}

                new_events = generator.generate(
                    data.get_gamestate(),
                    data.get_empire(),
                    data.get_empire_snapshot(),
                    data.get_empire_snapshots(),
                    data.get_processor_data()[generator.name()]
                )
                for event in new_events:
                    if event['type'] in events:
                        events[event['type']].append(event)
                    else:
                        events[event['type']] = [event]
            except:
                traceback.print_exc()
                continue
        
        for combiner in news.combiner_list:
            try:
                events = combiner.combine(events)
            except:
                traceback.print_exc()
                continue
        
        event_list = []
        for event_queue in events.values():
            event_list.extend(event_queue)
        data.get_empire_snapshot()['news'] = event_list
