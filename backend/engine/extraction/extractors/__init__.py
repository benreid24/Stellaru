from .metadata_extractor import MetadataExtractor
from .leader_extractor import LeaderExtractor
from .standing_extractor import StandngExtractor
from .war_extractor import WarExtractor
from .system_extractor import SystemExtractor
from .federation_extractor import FederationExtractor
from .unity_extractor import UnityExtractor
from .economy_extractor import EconomyExtractor
from .construction_extractor import ConstructionExtractor
from .tech_extractor import TechExtractor


def build_extractor_list(isolation_layer):
    return [
        MetadataExtractor(isolation_layer),
        LeaderExtractor(isolation_layer),
        StandngExtractor(isolation_layer),
        WarExtractor(isolation_layer),
        SystemExtractor(isolation_layer),
        FederationExtractor(isolation_layer),
        UnityExtractor(isolation_layer),
        EconomyExtractor(isolation_layer),
        ConstructionExtractor(isolation_layer),
        TechExtractor(isolation_layer)
    ]
