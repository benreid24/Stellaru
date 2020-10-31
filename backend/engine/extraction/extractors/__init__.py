from .metadata_extractor import MetadataExtractor
from .leader_extractor import LeaderExtractor
from .standing_extractor import StandngExtractor


def build_extractor_list(isolation_layer):
    return [
        MetadataExtractor(isolation_layer),
        LeaderExtractor(isolation_layer),
        StandngExtractor(isolation_layer)
    ]
