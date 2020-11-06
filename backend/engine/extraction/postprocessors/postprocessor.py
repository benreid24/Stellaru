class PostProcessor:
    def __init__(self, isolation_layer):
        self.isolation_layer = isolation_layer

    def name():
        raise Exception(f'name() method not implemented in postprocessor: {type(self).__name__}')

    def postprocess(self, data):
        raise Exception(f'postprocess() method not implemented in postprocessor: {type(self).__name__}')
