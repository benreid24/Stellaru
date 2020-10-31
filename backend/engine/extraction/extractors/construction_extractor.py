from .extractor import Extractor


class ConstructionExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'construction'

    def extract_data(self, state, empire):
        queues = self.isolation_layer.get_build_queues(state, empire)

        total_count = 0
        total_items = 0
        max_size = 0
        type_count = {}
        type_queues = {}
        for queue in queues:
            total_count += queue['simultaneous']
            total_items += queue['items']
            if queue['items'] > max_size:
                max_size = queue['items']
            if queue['type'] not in type_queues:
                type_count[queue['type']] = queue['simultaneous']
                type_queues[queue['type']] = [queue]
            else:
                type_count[queue['type']] += queue['simultaneous']
                type_queues[queue['type']].append(queue)

        breakdown = {
            qtype: {
                'queue_count': type_count[qtype],
                'queued_items': sum([queue['items'] for queue in qlist]),
                'avg_queue_size': sum([queue['items'] for queue in qlist]) / len(qlist) if len(qlist) > 0 else 0,
                'max_queue_size': max([queue['items'] for queue in qlist])
            } for qtype, qlist in type_queues.items()
        }

        return {
            'queue_count': total_count,
            'queued_items': total_items,
            'avg_queue_size': total_items / len(queues) if len(queues) > 0 else 0,
            'max_queue_size': max_size,
            'breakdown': breakdown
        }
