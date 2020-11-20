from .treaty_generator import TreatyGenerator
from .war_generator import WarGenerator
from .diplomacy_generator import DiplomacyGenerator
from .federation_generator import FederationGenerator


def build_generator_list(isolation_layer):
    return [
        TreatyGenerator(isolation_layer),
        WarGenerator(isolation_layer),
        DiplomacyGenerator(isolation_layer),
        FederationGenerator(isolation_layer)
    ]
