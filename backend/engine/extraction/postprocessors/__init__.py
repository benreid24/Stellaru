from .comparison_processor import ComparisonProcessor
from .leaderboard_processor import LeaderboardProcessor


def build_postprocessor_list(isolation_layer):
    return [
        ComparisonProcessor(isolation_layer),
        LeaderboardProcessor(isolation_layer)
    ]
