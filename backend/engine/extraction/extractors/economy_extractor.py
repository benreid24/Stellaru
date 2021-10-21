from .extractor import Extractor

EC_SB = 'Starbases'
EC_SB_BASE = 'Base'
EC_SB_BUILDINGS = 'Buildings'
EC_SB_MODULES = 'Modules'
EC_TRADE = 'Trade'
EC_MEGA = 'Megastructures'
EC_STATIONS = 'Stations'
EC_SHIPS = 'Ships'
EC_SHIPS_BASE = 'Base'
EC_SHIPS_COMP = 'Components'
EC_PLANETS_DISTRICTS = 'Districts'
EC_PLANETS_BUILDINGS = 'Buildings'
EC_PLANET_POPS = 'Pops'
EC_PLANETS_JOBS = 'Jobs'
EC_LEADERS = 'Leaders'
EC_ARMIES = 'Armies'
EC_BASE = 'Base'

ECONOMY_CLASSES = {
    'trade_routes': [EC_TRADE],
    'megastructures': [EC_MEGA],
    'ships': [EC_SHIPS, EC_SHIPS_BASE],
    'ship_components': [EC_SHIPS, EC_SHIPS_COMP],
    'station_gatherers': [EC_SB, EC_SB_BUILDINGS],
    'station_researchers': [EC_SB, EC_SB_BUILDINGS],
    'starbase_stations': [EC_SB, EC_SB_BASE],
    'starbase_buildings': [EC_SB, EC_SB_BUILDINGS],
    'starbase_modules': [EC_SB, EC_SB_MODULES],
    'planet_buildings': [EC_PLANETS_BUILDINGS],
    'planet_buildings_strongholds': [EC_PLANETS_BUILDINGS],
    'planet_districts': [EC_PLANETS_DISTRICTS],
    'planet_districts_cities': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_energy': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_research': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_mining': [EC_PLANETS_DISTRICTS],
    'planet_districts_hab_trade': [EC_PLANETS_DISTRICTS],
    'planet_pop_assemblers': [EC_PLANETS_JOBS, 'Assemblers'],
    'planet_farmers': [EC_PLANETS_JOBS, 'Farmers'],
    'planet_miners': [EC_PLANETS_JOBS, 'Miners'],
    'planet_technician': [EC_PLANETS_JOBS, 'Technicians'],
    'planet_administrators': [EC_PLANETS_JOBS, 'Administrators'],
    'planet_bureaucrats': [EC_PLANETS_JOBS, 'Bureaucrats'],
    'planet_researchers': [EC_PLANETS_JOBS, 'Researchers'],
    'planet_metallurgists': [EC_PLANETS_JOBS, 'Metallurgists'],
    'planet_culture_workers': [EC_PLANETS_JOBS, 'Culture Workers'],
    'planet_entertainers': [EC_PLANETS_JOBS, 'Entertainers'],
    'planet_enforcers': [EC_PLANETS_JOBS, 'Enforcers'],
    'planet_doctors': [EC_PLANETS_JOBS, 'Doctors'],
    'planet_refiners': [EC_PLANETS_JOBS, 'Refiners'],
    'planet_translucers': [EC_PLANETS_JOBS, 'Translucers'],
    'planet_chemists': [EC_PLANETS_JOBS, 'Chemists'],
    'planet_artisans': [EC_PLANETS_JOBS, 'Artisans'],
    'pop_category_robot': [EC_PLANET_POPS, 'Robots'],
    'pop_category_slaves': [EC_PLANET_POPS, 'Slaves'],
    'pop_category_workers': [EC_PLANET_POPS, 'Workers'],
    'pop_category_specialists': [EC_PLANET_POPS, 'Specialists'],
    'pop_category_rulers': [EC_PLANET_POPS, 'Rulers'],
    'planet_deposits': ['Other'],
    'orbital_mining_deposits': [EC_STATIONS],
    'orbital_research_deposits': [EC_STATIONS],
    'armies': [EC_ARMIES],
    'leader_admirals': [EC_LEADERS],
    'leader_generals': [EC_LEADERS],
    'leader_scientists': [EC_LEADERS],
    'leader_governors': [EC_LEADERS],
    'pop_factions': [EC_PLANET_POPS, 'Factions'],
    'country_base': [EC_BASE]
}


class EconomyExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'economy'

    def extract_data(self, state, empire):
        eco = self.isolation_layer.get_economy(state, empire)
        prices = self.isolation_layer.get_market_prices(state, empire)

        income = EconomyExtractor._build_resource_breakdown(eco['income'])
        spending = EconomyExtractor._build_resource_breakdown(eco['spending'])
        nets = {}
        for resource in income.keys():
            net = income[resource]['total']
            if resource in spending:
                net -= spending[resource]['total']
            nets[resource] = net

        base_gdp = self._get_gdp(income, spending, nets, eco['stockpile'], self.isolation_layer.BASE_PRICES)
        adjusted_gdp = self._get_gdp(income, spending, nets, eco['stockpile'], prices)

        return {
            'stockpile': eco['stockpile'],
            'net_income': nets,
            'income': income,
            'spending': spending,
            'market_prices': prices,
            'base_gdp': base_gdp,
            'adjusted_gdp': adjusted_gdp
        }

    @staticmethod
    def _classify_resource_producer(name):
        if name in ECONOMY_CLASSES:
            return ECONOMY_CLASSES[name]
        
        if 'planet' in name:
            if 'district' in name:
                return [EC_PLANETS_DISTRICTS]
            if 'pop' in name:
                return [EC_PLANET_POPS, name.split('_')[-1].capitalize()]
            return [EC_PLANETS_JOBS, name.split('_')[-1].capitalize()]
        if 'orbital' in name:
            return [EC_STATIONS]
        if 'starbase' in name or 'station' in name:
            return [EC_SB, 'Other']
        if 'ship' in name:
            return [EC_SHIPS, 'Other']
        return [' '.join([word.capitalize() for word in name.split('_')])]


    @staticmethod
    def _build_resource_breakdown(budget):
        breakdown = {}
        for producer, resources in budget.items():
            if not resources:
                continue
            classes = EconomyExtractor._classify_resource_producer(producer)
            for resource, amount in resources.items():
                if resource not in breakdown:
                    breakdown[resource] = {
                        'total': amount,
                        'breakdown': {}
                    }
                else:
                    breakdown[resource]['total'] += amount
                rb = breakdown[resource]['breakdown']
                for class_name in classes:
                    if class_name not in rb:
                        rb[class_name] = {
                            'total': amount,
                            'breakdown': {}
                        }
                    else:
                        rb[class_name]['total'] += amount
                    rb = rb[class_name]['breakdown']
        return breakdown

    def _get_gdp(self, income, spending, net, stockpile, prices):
        gross_income = {}
        gross_spending = {}
        net_gdp = {}
        stockpile_value = {}

        for resource in self.isolation_layer.MARKET_RESOURCES:
            i = income[resource]['total'] if resource in income else 0
            gross_income[resource] = prices[resource] * i
            s = spending[resource]['total'] if resource in spending else 0
            gross_spending[resource] = prices[resource] * s
            n = net[resource] if resource in net else 0
            net_gdp[resource] = prices[resource] * n
            v = stockpile[resource] if resource in stockpile else 0
            stockpile_value[resource] = v * prices[resource]

        gross_income['energy'] = income['energy']['total'] if 'energy' in income else 0
        gross_spending['energy'] = spending['energy']['total'] if 'energy' in spending else 0
        net_gdp['energy'] = net['energy'] if 'energy' in net else 0
        stockpile_value['energy'] = stockpile['energy'] if 'energy' in stockpile else 0

        return {
            'inflows': gross_income,
            'outflows': gross_spending,
            'net': net_gdp,
            'stockpile_values': stockpile_value,
            'total_inflows': sum([val for r, val in gross_income.items()]),
            'total_outflows': sum([val for r, val in gross_spending.items()]),
            'total_net': sum([val for r, val in net_gdp.items()]),
            'total_stockpile_value': sum([v for r, v in stockpile_value.items()])
        }
