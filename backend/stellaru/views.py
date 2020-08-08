import os

from django.http import HttpResponse
from django.conf import settings

from engine import sessions


def index(request):
    request.session.set_expiry(300)
    sessions.register_session(request.session)
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except:
        return HttpResponse('React frontend not found', status=501)
