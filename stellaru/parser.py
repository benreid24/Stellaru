from zipfile import ZipFile
import io

WHITESPACE = '\n \t'

class File:
    def __init__(self, data):
        self.data = data
        self.pos = 0
        self.size = len(data)

    def read(self, n=1):
        self.pos = min(self.size, self.pos + n)
        return self.data[self.pos-n:self.pos]

    def peek(self, n=1):
        if self.pos >= self.size:
            return ''
        return self.data[self.pos:min(self.size, self.pos + n)]
    
    def eof(self):
        return self.pos >= self.size

    def peekto(self, delim):
        if self.pos >= self.size:
            return ''
        i = self.pos
        while self.data[i] not in delim and i < self.size:
            i += 1
        return self.data[self.pos:min(self.size, i+1)]

    def readto(self, delim):
        if self.pos >= self.size:
            return ''
        i = self.pos
        while self.data[i] not in delim and i < self.size:
            i += 1
        return self.read(i - self.pos + 1)[0:-1]

    def skipto(self, delim):
        while self.pos < self.size and self.data[self.pos] not in delim:
            self.pos += 1

    def skip(self, skip_chars):
        while self.pos < self.size and self.data[self.pos] in skip_chars:
            self.pos += 1

    def tell(self):
        return self.pos

    def seek(self, pos):
        self.pos = pos


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
        return value_str
    if '.' in value_str:
        return float(value_str)
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


def parse_save(file):
    meta_file, state_file = _open_save(file)

    meta = _parse_dict(meta_file)
    state = None
    try:
        state = _parse_dict(state_file)
    except:
        pass

    return meta, state
