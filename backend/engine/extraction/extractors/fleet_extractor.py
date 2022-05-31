from .extractor import Extractor
from engine.extraction.isolation import util

SHIP_SIZES = {
    'Corvette': 1,
    'Destroyer': 2,
    'Cruiser': 4,
    'Battleship': 8,
    'Titan': 16,
    'Colossus': 32
}


class FleetExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'fleets'

    def extract_data(self, state, empire):
        fleet_info = self.isolation_layer.get_fleets(state, empire)
        fleets = fleet_info['fleets']
        
        ship_breakdown = {}
        power_stats = util.basic_stats([fleet['power'] for fleet in fleets.values() if fleet['power'] > 0])
        ship_stats = util.basic_stats([fleet['ship_count'] for fleet in fleets.values()])
        total_size = 0
        for fleet in fleets.values():
            for stype, scount in fleet['ships'].items():
                if stype not in ship_breakdown:
                    ship_breakdown[stype] = scount
                else:
                    ship_breakdown[stype] += scount
                total_size += FleetExtractor._get_ship_size(stype) * scount

        return {
            'total': len(fleets),
            'fleet_power': power_stats,
            'ships': ship_stats,
            'ship_types': ship_breakdown,
            'avg_ship_exp': fleet_info['total_exp'] / fleet_info['total_ships'] if fleet_info['total_ships'] != 0 else 0,
            'fleets': fleets,
            'total_size': total_size
        }

    @staticmethod
    def _get_ship_size(stype):
        return SHIP_SIZES[stype] if stype in SHIP_SIZES else 0
