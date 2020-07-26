import os
import json


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
            f = open(os.path.join(folder, f'{key}.json'), 'w')
            f.write(json.dumps(state[key], indent=4))
            f.close()
