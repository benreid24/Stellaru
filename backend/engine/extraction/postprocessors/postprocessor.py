from .postprocessor_data import PostprocessorData


class PostProcessor:
    def __init__(self, isolation_layer):
        self.isolation_layer = isolation_layer

    def name(self):
        return type(self).__name__

    def postprocess(self, data: PostprocessorData):
        raise Exception(f'postprocess() method not implemented in postprocessor: {self.name()}')
