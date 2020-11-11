import math

DAYS_PER_MONTH = 30
DAYS_PER_YEAR = DAYS_PER_MONTH * 12


def date_days(date_str):
    comps = parse_date(date_str)
    return comps['y'] * DAYS_PER_YEAR + comps['m'] * DAYS_PER_MONTH + comps['d']


def date_diff_days(future, past):
    year_diff = future['y'] - past['y']
    month_diff = future['m'] + (12 - past['m'])
    day_diff = future['d'] + (DAYS_PER_MONTH - past['d'])
    return year_diff * DAYS_PER_YEAR + month_diff * DAYS_PER_MONTH + day_diff


def parse_date(date_str):
    comps = date_str.split('.')
    if len(comps) != 3:
        return {'y': 0, 'm': 0, 'd': 0}
    return {
        'y': int(comps[0]),
        'm': int(comps[1]),
        'd': int(comps[2])
    }


def construct_date(days):
    if isinstance(days, dict):
        return f"{days['y']}.{days['m']:02}.{days['d']:02}"
    y = math.floor(days / DAYS_PER_YEAR)
    days -= y * DAYS_PER_YEAR
    m = math.floor(days / DAYS_PER_MONTH)
    days -= m * DAYS_PER_MONTH
    return f'{y}.{m+1:02}.{days:02}'


def basic_stats(values):
    return {
        'avg': sum(values) / len(values) if len(values) > 0 else 0,
        'min': min(values) if len(values) > 0 else 0,
        'max': max(values) if len(values) > 0 else 0,
        'total': sum(values) if len(values) > 0 else 0
    }
