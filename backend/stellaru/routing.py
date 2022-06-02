from django.urls import path
from channels.routing import ProtocolTypeRouter,URLRouter
from channels.sessions import SessionMiddlewareStack

from stellaru_api.subscription import Subscription

application = ProtocolTypeRouter({
    'websocket': SessionMiddlewareStack(
        URLRouter([
            path('api/subscribe', Subscription.as_asgi())
        ])
    ),
})
