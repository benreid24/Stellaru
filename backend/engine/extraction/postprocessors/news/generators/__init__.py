from .treaty_generator import TreatyGenerator


def build_generator_list(isolation_layer):
    return [
        TreatyGenerator(isolation_layer)
    ]
