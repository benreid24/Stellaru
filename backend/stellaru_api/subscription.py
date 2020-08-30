
import os
from channels.generic.websocket import JsonWebsocketConsumer

from engine import sessions
from engine import engine

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
        if 'subscribe' in content:
            info = content['subscribe']
            if 'save' in info and 'empire' in info:
                folder = os.path.dirname(info['save'])
                sessions.reconnect_session(self.id, info['empire'], self)
                engine.session_reconnected(self.id, folder)

    def disconnect(self, code):
        print(f'Client {self.id} disconnected with code {code}')
        sessions.clear_session(self.id)
