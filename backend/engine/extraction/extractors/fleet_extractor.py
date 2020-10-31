from .extractor import Extractor
from engine.extraction import util


class FleetExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'fleets'

    def extract_data(self, state, empire):
        fleet_info = self.isolation_layer.get_fleets(state, empire)
        fleets = fleet_info['fleets']
        
        ship_breakdown = {}
        power_stats = util.basic_stats([fleet['power'] for fleet in fleets])
        ship_stats = util.basic_stats([fleet['ship_count'] for fleet in fleets])
        for fleet in fleets:
            for stype, scount in fleet['ships'].items():
                if stype not in ship_breakdown:
                    ship_breakdown[stype] = scount
                else:
                    ship_breakdown[stype] += scount

        return {
            'total': len(fleets),
            'fleet_power': sum([fleet['power'] for fleet in fleets]),
            'ships': ship_stats,
            'ship_types': ship_breakdown,
            'avg_ship_exp': fleet_info['total_exp'] / fleet_info['total_ships'] if fleet_info['total_ships'] != 0 else 0,
            'fleets': fleets
        }
