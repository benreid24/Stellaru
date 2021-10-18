from .postprocessor import PostProcessor


class LeaderboardProcessor(PostProcessor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def name(self):
        return 'LeaderboardProcessor'

    def postprocess(self, data):
        eid = data.get_empire()
        empire = data.get_empire_snapshot()
        if not self.isolation_layer.empire_valid(data.get_gamestate(), eid):
            return

        summaries = {
            eid: LeaderboardProcessor._summarize_empire(eid, empire)
            for eid, empire in data.get_full_snapshot()['empires'].items()
        }

        empire['leaderboard'] = {
            'empire_summaries': summaries
        }

    @staticmethod
    def _summarize_empire(empire_id, empire_snapshot):
        return {
            'id': empire_id,
            'name': empire_snapshot['name'],
            'player_name': empire_snapshot['player_name'],
            'type': empire_snapshot['type'],
            'sprawl': empire_snapshot['sprawl'],
            'victory_points': empire_snapshot['standing']['victory_points'],
            'system_count': empire_snapshot['systems']['owned'],
            'starbase_count': empire_snapshot['systems']['starbases'],
            'gdp': {
                'base': empire_snapshot['economy']['base_gdp'],
                'adjusted': empire_snapshot['economy']['adjusted_gdp']
            },
            'tech': empire_snapshot['tech'],
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
