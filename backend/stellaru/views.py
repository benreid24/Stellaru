import os
import string
import random

from django.http import HttpResponse
from django.conf import settings


def index(request):
    request.session.set_expiry(300)
    if 'id' not in request.session.keys():
        request.session['id'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except:
        return HttpResponse('React frontend not found', status=501)
