import os
import json


def _make_safe(name):
    return name.replace('"', '')


def _recursive(d):
    if not isinstance(d, dict):
        return False
    for k,v in d.items():
        if isinstance(v, dict):
            return True
    return False


def write(state, folder):
    try:
        os.makedirs(folder)
    except FileExistsError:
        pass

    for key in state.keys():
        if _recursive(state[key]):
            write(state[key], os.path.join(folder, key))
        else:
            try:
                with open(os.path.join(folder, f'{_make_safe(key)}.json'), 'w') as f:
                    f.write(json.dumps(state[key], indent=4))
            except:
                pass
