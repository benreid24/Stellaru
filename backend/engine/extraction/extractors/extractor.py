class Extractor:
    def __init__(self, isolation_layer):
        self.isolation_layer = isolation_layer

    def extract_data(self, state, empire):
        raise Exception('extract_data() method not implemented on extractor')
