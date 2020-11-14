import math


def ensure_exists(obj, key, default_value={}):
    if key not in obj:
        obj[key] = default_value


def days_to_string(days):
    if days <= 90:
        return f'{days} days'
    if days <= 18 * 30:
        return f'{round(days / 30)} months'
    years = math.floor(days / 360)
    days -= years * 360
    months = round(days / 30)
    return f'{years} years and {months} months'
