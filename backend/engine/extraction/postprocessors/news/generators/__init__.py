from .treaty_generator import TreatyGenerator
from .war_generator import WarGenerator


def build_generator_list(isolation_layer):
    return [
        TreatyGenerator(isolation_layer),
        WarGenerator(isolation_layer)
    ]
