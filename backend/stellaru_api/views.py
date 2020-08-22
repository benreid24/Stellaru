from datetime import datetime
import os
import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from engine import sessions
from engine import finder
from engine import parser
from engine.watcher import Watcher
from engine import engine


def _make_error(error):
    return JsonResponse({'error': repr(error)}, status=400)


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
        print(f'Error: {err}')
        return _make_error(err)


@csrf_exempt
def get_empires(request):
    file = None
    try:
        parsed = json.loads(request.body)
        if 'file' not in parsed:
            return _make_error('"file" parameter not set in POST')
        file = parsed['file']
    except Exception as err:
        return _make_error('Bad request body')
    if 'id' not in request.session:
        return _make_error('Session expired')

    folder = os.path.dirname(file)
    watcher = Watcher(folder)
    if not watcher.valid:
        return _make_error('Invalid directory')

    save = engine.load_and_add_save(watcher, request.session['id'])
    empires = [{
        'id': empire_id,
        'name': save['snaps'][-1]['empires'][empire_id]['name'],
        'player': save['snaps'][-1]['empires'][empire_id]['player_name']
    } for empire_id in save['snaps'][-1]['empires']]
    return JsonResponse({
        'folder': folder,
        'empires': empires
    })


@csrf_exempt
def get_data(request):
    try:
        parsed = json.loads(request.body)
        if 'file' not in parsed:
            return _make_error('"folder" parameter not set in POST')
        if 'empire' not in parsed:
            return _make_error('"empire" parameter not set in POST')
        folder = os.path.dirname(parsed['file'])
        empire = parsed['empire']
        save = engine.get_save(folder)
        if not save:
            return _make_error(f'Invalid save: {folder}')
        if empire not in save['snaps'][-1]['empires']:
            return _make_error(f'Empire {empire} not in save {folder}')
        sessions.set_session_empire(request.session['id'], empire)
        snaps = [snap['empires'][empire] for snap in save['snaps']]
        return JsonResponse({
            'folder': folder,
            'empire': empire,
            'snaps': snaps
        })
    except Exception as err:
        return _make_error(f'Bad request body: {repr(err)}')
