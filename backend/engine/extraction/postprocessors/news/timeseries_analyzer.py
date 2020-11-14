import math

class TimeseriesAnalyzer:
    INCREASING = 'up'
    DESCREASING = 'down'
    SIDEWAYS = 'sideways'
    POSITIVE = 'positive'
    NEGATIVE = 'negative'

    def __init__(self, key, datastore, lookback_period):
        if key not in datastore:
            datastore[key] = {
                'history': [],
            }
        self.data = datastore[key]
        self.lookback = lookback_period
        self._refresh()

    def add_point(self, value, date_days):
        self.data['history'].append({
            'value': value,
            'date': date_days
        })
        self.data['history'] = [
            point for point in self.data['history']
            if point['date'] >= date_days - self.lookback
        ]
        self._refresh()

    def _refresh(self):
        if not self.data['history']:
            return
        points = self.data['history']

        self.sign = {
            'sign': TimeseriesAnalyzer.POSITIVE if points[-1]['value'] >= 0 else TimeseriesAnalyzer.NEGATIVE,
            'since': points[-1]['date']
        }
        for point in reversed(points):
            if point['value'] < 0 and self.sign['sign'] == TimeseriesAnalyzer.POSITIVE:
                break
            if point['value'] >= 0 and self.sign['sign'] == TimeseriesAnalyzer.NEGATIVE:
                break
            self.sign['since'] = point['date']

        self.average = sum([point['value'] for point in points]) / len(points)
        self.variance = sum([(point['value'] - self.average)**2 for point in points]) / len(points)
        self.stddev = self.variance**0.5

        TREND_THRESH = 0.15
        RECENT_LENGTH_THRESH = 720

        self.overall_trend = TimeseriesAnalyzer.SIDEWAYS
        if points[-1]['value'] - points[0]['value'] >= self.average * TREND_THRESH:
            self.overall_trend = TimeseriesAnalyzer.INCREASING
        elif points[-1]['value'] - points[0]['value'] <= -self.average * TREND_THRESH:
            self.overall_trend = TimeseriesAnalyzer.DESCREASING

        self.recent_trend = None
        if points[-1]['date'] - points[0]['date'] >= RECENT_LENGTH_THRESH:
            self.recent_trend = TimeseriesAnalyzer.SIDEWAYS
            recent_point = points[math.floor(len(points) * 0.75)]['value']
            if points[-1]['value'] - recent_point >= self.average * TREND_THRESH:
                self.recent_trend = TimeseriesAnalyzer.INCREASING
            elif points[-1]['value'] - recent_point <= -self.average * TREND_THRESH:
                self.recent_trend = TimeseriesAnalyzer.DESCREASING
