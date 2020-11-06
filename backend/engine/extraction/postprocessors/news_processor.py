from .postprocessor import PostProcessor
from .postprocessor_data import PostprocessorData
from . import news


class NewsProcessor(PostProcessor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def postprocess(self, data: PostprocessorData):
        events = {}
        for generator in news.generator_list:
            meta_hist = [item[generator.name()] for item in data.get_processor_history() if generator.name() in item else {}]
            data.get_processor_current_data()[generator.name()] = {}
            if generator.name() not in data.get_processor_static_data():
                data.get_processor_static_data()[generator.name()] = {}

            new_events = generator.generate(
                data.get_gamestate(),
                data.get_empire(),
                data.get_empire_snapshot(),
                data.get_empire_snapshots(),
                meta_hist,
                data.get_processor_current_data()[generator.name()],
                data.get_processor_static_data()[generator.name()]
            )
            for event in new_events:
                if event['type'] in events:
                    events[event['type']].append(event)
                else:
                    events[event['type']] = [event]
        
        for combiner in news.combiner_list:
            events = combiner.combine(events)
        
        event_list = []
        for event_queue in events.values():
            event_list.extend(event_queue)
        data.get_empire_snapshot()['news'] = event_list
