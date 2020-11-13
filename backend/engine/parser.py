from zipfile import ZipFile
import io
import traceback

from engine.util import InMemoryFile

WHITESPACE = '\n \t'


def _open_save(file):
    with ZipFile(file) as zipped:
        meta = InMemoryFile(zipped.read('meta').decode('utf-8'))
        gamestate = InMemoryFile(zipped.read('gamestate').decode('utf-8'))
        return meta, gamestate


def save_valid(file):
    with ZipFile(file) as zipped:
        return 'meta' in zipped.namelist() and 'gamestate' in zipped.namelist()


def _parse_data(file):
    PARSING_DICT = 0
    PARSING_LIST = 1
    PARSING_DICT_OR_LIST = 2
    PARSING_OBJECT = 3
    PARSING_VALUE = 4

    states = [PARSING_DICT] # stack
    current_object = [{}] # treat like stack, top is current data bottom is final data
    can_reduce = False

    def reduce_dict():
        if len(current_object) > 2 and isinstance(current_object[-3], dict): # dict, name, value
            value = current_object.pop(-1)
            key = current_object.pop(-1)
            if key in current_object[-1]:
                if isinstance(current_object[-1][key], list):
                    current_object[-1][key].append(value)
                else:
                    current_object[-1][key] = [current_object[-1][key], value]
            else:
                current_object[-1][key] = value

    while not file.eof():
        file.skip(WHITESPACE)
        if file.eof():
            break
        if not states:
            raise Exception('Invalid states, empty')

        if PARSING_DICT == states[-1]:
            # Check if value was read and needs to be added to dict
            if can_reduce:
                reduce_dict()
            
            # Check if dict fully read
            if file.peek() == '}':
                file.read()
                states.pop()
                continue
            
            # Read name and switch state
            can_reduce = True
            name = file.readto('=')
            if name.isnumeric():
                name = int(name)
            current_object.append(name)
            states.append(PARSING_OBJECT)

        elif PARSING_LIST == states[-1]:
            # Check if read value needs to be appended
            if not isinstance(current_object[-1], list) or states[-2] == PARSING_LIST:
                value = current_object.pop(-1)
                current_object[-1].append(value)
            
            # Check if end of list reached
            if file.peek() == '}':
                file.read()
                states.pop(-1)
                continue
            
            # Switch to read value
            states.append(PARSING_OBJECT)

        elif PARSING_DICT_OR_LIST == states[-1]:
            # Determine which and replace state
            delim = file.peekto('=}{')[-1]
            if '=' == delim:
                can_reduce = False
                current_object.append({})
                states[-1] = PARSING_DICT
            else:
                current_object.append([])
                states[-1] = PARSING_LIST

        elif PARSING_OBJECT == states[-1]:
            # Determine object or value and replace state
            if file.peek() == '{':
                file.read()
                states[-1] = PARSING_DICT_OR_LIST
            else:
                states[-1] = PARSING_VALUE

        elif PARSING_VALUE == states[-1]:
            # Append string or number and pop state
            if file.peek() == '"':
                file.read()
                current_object.append(file.readto('"'))
            else:
                value_str = file.readto(WHITESPACE)
                if not value_str.isnumeric():
                    try:
                        fval = float(value_str)
                        current_object.append(fval)
                    except ValueError:
                        current_object.append(value_str)
                else:
                    current_object.append(int(value_str))
            states.pop(-1)

        else:
            raise Exception(f'Unexpected state {states[-1]}')

    reduce_dict()
    if len(current_object) != 1:
        raise Exception('Parsing did not yield a single root object')
    return current_object[0]


def load_meta(file):
    meta_file, state_file = _open_save(file)
    try:
        return _parse_data(meta_file)
    except:
        traceback.print_exc()


def parse_save(file):
    meta_file, state_file = _open_save(file)

    # TODO - consider writing a grammar and using a real parser
    meta = _parse_data(meta_file)
    state = _parse_data(state_file)

    return meta, state
