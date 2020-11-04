from .comparison_processor import ComparisonProcessor


def build_postprocessor_list(isolation_layer):
    return [
        ComparisonProcessor(isolation_layer)
    ]
