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
