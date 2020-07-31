import os

from django.http import HttpResponse
from django.conf import settings


def index(request):
    print(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except:
        return HttpResponse('React frontend not found', status=501)
