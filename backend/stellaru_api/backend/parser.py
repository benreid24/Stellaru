from zipfile import ZipFile
import io

from .file import File

WHITESPACE = '\n \t'


def _open_save(file):
    with ZipFile(file) as zipped:
        meta = File(zipped.read('meta').decode('utf-8'))
        gamestate = File(zipped.read('gamestate').decode('utf-8'))
        return meta, gamestate


def _parse_value(file):
    if file.peek() == '"':
        file.read()
        return file.readto('"')
    else:
        value_str = file.readto(WHITESPACE)
    if not value_str.isnumeric():
        try:
            fval = float(value_str)
            return fval
        except ValueError:
            return value_str
    return int(value_str)


def _parse_list(file):
    file.skip(WHITESPACE)

    value = []
    while not file.eof():
        file.skip(WHITESPACE)
        if file.peek() == '}':
            file.read()
            file.skip(WHITESPACE)
            break
        value.append(_parse_object(file))

    return value


def _parse_dict(file):
    file.skip(WHITESPACE)

    values = {}
    while not file.eof():
        name = file.readto('=')
        if name.isnumeric():
            name = int(name)
        value = _parse_object(file)
        if name in values:
            if isinstance(values[name], list):
                values[name].append(value)
            else:
                values[name] = [values[name], value]
        else:
            values[name] = value

        file.skip(WHITESPACE)
        if file.peek() == '}':
            file.read()
            file.skip(WHITESPACE)
            break

    return values


def _parse_dict_or_list(file):
    delim = file.peekto('=}{')[-1]
    if '=' == delim:
        return _parse_dict(file)
    return _parse_list(file)


def _parse_object(file):
    file.skip(WHITESPACE)
    if file.peek() == '{':
        file.read()
        file.skip(WHITESPACE)
        return _parse_dict_or_list(file)
    return _parse_value(file)


def load_meta(file):
    meta_file, state_file = _open_save(file)
    return _parse_dict(meta_file)


def parse_save(file):
    meta_file, state_file = _open_save(file)

    # TODO - consider writing a grammar and using a real parser
    meta = _parse_dict(meta_file)
    state = _parse_dict(state_file)

    return meta, state
