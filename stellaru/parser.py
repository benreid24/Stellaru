from zipfile import ZipFile
import io


def _open_save(file):
    with ZipFile(file) as zipped:
        meta = io.StringIO(zipped.read('meta').decode('utf-8'))
        gamestate = io.StringIO(zipped.read('gamestate').decode('utf-8'))
        return meta, gamestate


def _peek(file):
    pos = file.tell()
    c = file.read(1)
    file.seek(pos)
    return c


def _peekline(file):
    pos = file.tell()
    l = file.readline()
    file.seek(pos)
    return l


def _eof(file):
    pos = file.tell()
    at_eof = len(file.read(1)) == 0
    file.seek(pos)
    return at_eof


def _skip_whitespace(file):
    while _peek(file) in '\n \t' and not _eof(file):
        file.read(1)


def _read_to(file, delim):
    pos = file.tell()
    while  not _eof(file):
        c = file.read(1)
        if c in delim:
            break
        if '"' == c:
            _read_to(file, '"')
    end_pos = file.tell()
    file.seek(pos)
    data = file.read(end_pos - pos)
    return data[0:-1]


def _parse_value(file):
    value_str = _read_to(file, '\n ')
    if '"' in value_str:
        return value_str[1:-1]
    if not value_str.isnumeric():
        return value_str
    if '.' in value_str:
        return float(value_str)
    return int(value_str)


def _parse_list(file):
    value = []
    while '}' not in _peekline(file) and not _eof(file):
        value.append(_parse_object(file))
        _skip_whitespace(file)
    _skip_whitespace(file)
    if _peek(file) == '}':
        file.read(1)
        _skip_whitespace(file)
    return value


def _parse_dict(file):
    values = {}
    while '}' not in _peekline(file) and not _eof(file):
        name = _read_to(file, '=')
        value = _parse_object(file)
        values[name] = value
        _skip_whitespace(file)
    _skip_whitespace(file)
    if _peek(file) == '}':
        file.read(1)
        _skip_whitespace(file)
    return values


def _parse_dict_or_list(file):
    line = _peekline(file)
    if '=' in line:
        return _parse_dict(file)
    return _parse_list(file)


def _parse_object(file):
    _skip_whitespace(file)
    if _peek(file) == '{':
        file.read(1)
        _skip_whitespace(file)
        return _parse_dict_or_list(file)

    line = _peekline(file)
    if '=' in line:
        return _parse_dict(file)
    return _parse_value(file)


def parse_save(file):
    meta_file, state_file = _open_save(file)

    meta = _parse_object(meta_file)
    state = _parse_object(state_file)
    meta_file.close()
    state_file.close()

    return meta, state
