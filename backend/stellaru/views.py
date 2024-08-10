import os
import mimetypes

from django.http import HttpResponse
from django.conf import settings

from engine import sessions


def index(request):
    request.session.set_expiry(300)
    sessions.register_session(request.session)
    try:
        with open(os.path.join(settings.STATIC_ROOT, 'index.html')) as f:
            return HttpResponse(f.read())
    except:
        return HttpResponse('React frontend not found', status=501)
    

def static_file(request, file_path):
    try:
        with open(os.path.join(settings.STATIC_ROOT, file_path), 'rb') as f:
            mime_type = mimetypes.guess_type(file_path)[0]
            if not mime_type:
                mime_type = 'application/octet-stream'

            response = HttpResponse(f.read(), content_type=mime_type)
            response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
            return response
    except:
        return HttpResponse(f'React frontend not found', status=404)
