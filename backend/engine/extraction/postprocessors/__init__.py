from .comparison_processor import ComparisonProcessor
from .news_processor import NewsProcessor


def build_postprocessor_list(isolation_layer):
    return [
        ComparisonProcessor(isolation_layer),
        NewsProcessor(isolation_layer)
    ]
