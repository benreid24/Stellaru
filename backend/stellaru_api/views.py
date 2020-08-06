from datetime import datetime
import os

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from .backend import finder
from .backend import parser
from .backend.watcher import Watcher
from .backend import datastore


def _make_error(error):
    return JsonResponse({'error': repr(error)})


def get_saves(request):
    try:
        save_files = finder.find_saves()
        saves = [
            {
                'meta': parser.load_meta(save.get_file()),
                'file': save.get_file(),
                'time': save.time(),
                'history': save.has_history
            } for save in save_files if save.valid
        ]
        saves = [
            {
                'file': save['file'],
                'history': save['history'],
                'name': save['meta']['name'],
                'gameDate': save['meta']['date'],
                'fileDatetime': datetime.fromtimestamp(save['time'])
            } for save in saves
        ]
        return JsonResponse({'saves': saves})
    except Exception as err:
        return _make_error(err)


def get_empires(request):
    if 'id' not in request.session:
        return _make_error('No session id')
    if 'file' not in request.POST:
        return _make_error('"file" parameter not set in POST')
    folder = os.path.dirname(request.POST['file'])
    watcher = Watcher(folder)
    if not watcher.valid:
        return _make_error('Invalid directory')

    save = datastore.load_and_add_save(watcher, request.session['id'])
    empires = [{
        'id': empire_id,
        'name': save['empires'][empire_id]['snaps'][-1]['name']
    } for empire_id in save['empires']]
    return JsonResponse({
        'folder': folder,
        'empires': empires
    })
