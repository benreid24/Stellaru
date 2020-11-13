def ensure_exists(obj, key, default_value={}):
    if key not in obj:
        obj[key] = default_value
