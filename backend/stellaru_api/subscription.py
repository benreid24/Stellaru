from channels.generic.websocket import JsonWebsocketConsumer

from engine import sessions

class Subscription(JsonWebsocketConsumer):
    def connect(self):
        if 'id' not in self.scope['session']:
            self.id = sessions.register_session(self.scope['session'])
        else:
            self.id = self.scope['session']['id']
        print(f'Session {self.id} connected')

        sessions.set_session_socket(self.id, self)
        self.accept()

    def receive_json(self, content):
        print(f'Message received: Client: {self.id} Content: {content}')

    def disconnect(self, code):
        print(f'Client {self.id} disconnected with code {code}')
        sessions.clear_session(self.id)
