class Extractor:
    def __init__(self, isolation_layer):
        self.isolation_layer = isolation_layer

    def data_key(self):
        raise NotImplemented(f'data_key() method not implemented on extractor: {type(self).__name__}')

    def extract_data(self, state, empire):
        raise NotImplemented(f'extract_data() method not implemented on extractor: {type(self).__name__}')
    
    def make_default(self, state, empire):
        raise NotImplemented(f'make_default() not implemented on extractor: {type(self).__name__}')
