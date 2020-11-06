import random

from engine import extraction


def _fake_field(date, date_str, name, value):
    if name == 'date':
        return date_str
    if name == 'date_components':
        return date
    if name == 'date_days':
        return value + 30
    if isinstance(value, str) or isinstance(value, int):
        return value
    if isinstance(value, dict):
        return fake_dict(date, date_str, value)
    if isinstance(value, list):
        return [
            fake_field(date, date_str, v) for v in value
        ]
    pchg = random.randint(-3, 8) / 100 + 1
    return value * pchg


def _fake_dict(date, date_str, snap):
    return {
        name: fake_field(date, date_str, name, value)
        for name, value in snap.items()
    }


def fake_snap(snap):
    date = extraction.parse_date(snap['date'])
    date['m'] += 1
    if date['m'] >= 13:
        date['m'] = 1
        date['y'] += 1
    date_str = f'{date["y"]}.{date["m"]}.{date["d"]}'
    return {
        'date': date_str,
        'date_days': snap['date_days'] + 30,
        'empires': {
            eid: fake_dict(date, date_str, empire)
            for eid, empire in snap['empires'].items()
        }
    }


class InMemoryFile:
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
