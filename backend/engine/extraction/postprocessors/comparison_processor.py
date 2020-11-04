from .postprocessor import PostProcessor


class ComparisonProcessor(PostProcessor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def name(self):
        return 'ComparisonProcessor'

    def postprocess(self, data):
        eid = data.get_empire()
        empire = data.get_empire_snapshot()
        if not self.isolation_layer.empire_valid(data.get_gamestate(), eid):
            return

        names = {}
        eco_comp = {eid: empire['economy']['base_gdp']['total_inflows']}
        sci_comp = {eid: empire['tech']['output']['total']}
        vp_comp = {eid: sum([v for t, v in empire['standing']['victory_points'].items()])}
        str_comp = {}
        fleet_strength = empire['fleets']['fleet_power']['total']
        for oid, oempire in data.get_full_snapshot()['empires'].items():
            names[oid] = oempire['name']
            try:
                if oid == eid or not self.isolation_layer.empire_valid(data.get_gamestate(), oid):
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
