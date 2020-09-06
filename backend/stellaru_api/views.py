from datetime import datetime
import os
import json
import traceback

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from engine import sessions
from engine import finder
from engine import parser
from engine.file_watcher import FileWatcher
from engine import engine


def _make_error(error):
    return JsonResponse({'error': repr(error)}, status=400)


def get_saves(request):
    try:
        sessions.register_session(request.session)
        save_files = finder.find_saves()
        saves = [
            {
                'meta': parser.load_meta(save.get_file_for_read()),
                'file': save.name(),
                'time': save.time(),
                'history': save.has_history()
            } for save in save_files if save.valid()
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
        traceback.print_tb(err.__traceback__)
        return _make_error(err)


def wait_save(request):
    try:
        sessions.register_session(request.session)
        save_watcher = finder.wait_for_save()
        if not save_watcher:
            return _make_error('No save created or saved while waiting')
        if not save_watcher.valid():
            return _make_error('No valid save found')

        save = engine.load_and_add_save(save_watcher, request.session['id'])
        empires = [{
            'id': empire_id,
            'name': save['snaps'][-1]['empires'][empire_id]['name'],
            'player': save['snaps'][-1]['empires'][empire_id]['player_name']
        } for empire_id in save['snaps'][-1]['empires']]

        return JsonResponse({
            'file': save_watcher.name(),
            'empires': empires
        })
    except Exception as err:
        traceback.print_tb(err.__traceback__)
        return _make_error(err)


@csrf_exempt
def get_empires(request):
    save_file = None
    try:
        sessions.register_session(request.session)
        parsed = json.loads(request.body)
        if 'file' not in parsed:
            return _make_error('"file" parameter not set in POST')
        save_file = parsed['file']

        save_watcher = finder.get_save(save_file)
        if not save_watcher or not save_watcher.valid():
            return _make_error(f'Invalid save file: {save_file}')

        save = engine.load_and_add_save(save_watcher, request.session['id'])
        empires = [{
            'id': empire_id,
            'name': save['snaps'][-1]['empires'][empire_id]['name'],
            'player': save['snaps'][-1]['empires'][empire_id]['player_name']
        } for empire_id in save['snaps'][-1]['empires']]

        return JsonResponse({
            'file': save_watcher.name(),
            'empires': empires
        })
    except Exception as err:
        traceback.print_tb(err.__traceback__)
        return _make_error(err)


@csrf_exempt
def get_data(request):
    try:
        sessions.register_session(request.session)
        parsed = json.loads(request.body)
        if 'file' not in parsed:
            return _make_error('"file" parameter not set in POST')
        if 'empire' not in parsed:
            return _make_error('"empire" parameter not set in POST')

        save_watcher = finder.get_save(parsed['file'])
        if not save_watcher or not save_watcher.valid():
            return _make_error(f'Invalid save file: {parsed["file"]}')

        empire = parsed['empire']
        save = engine.get_save(save_watcher, request.session['id'])
        if not save:
            return _make_error(f'Invalid save: {save_watcher.name()}')
        if empire not in save['snaps'][-1]['empires']:
            return _make_error(f'Empire {empire} not in save {save_watcher.name()}')

        sessions.set_session_empire(request.session['id'], empire)
        snaps = [snap['empires'][empire] for snap in save['snaps']]
        return JsonResponse({
            'file': save_watcher.name(),
            'empire': empire,
            'snaps': snaps
        })
    except Exception as err:
        return _make_error(f'Bad request body: {repr(err)}')


@csrf_exempt
def get_latest_snap(request):
    try:
        sessions.register_session(request.session)
        parsed = json.loads(request.body)
        if 'file' not in parsed:
            return _make_error('"file" parameter not set in POST')
        if 'empire' not in parsed:
            return _make_error('"empire" parameter not set in POST')

        save_watcher = finder.get_save(parsed['file'])
        if not save_watcher or not save_watcher.valid():
            return _make_error(f'Invalid save file: {parsed["file"]}')
        empire = parsed['empire']
        save = engine.get_save(save_watcher, request.session['id'], True)
        if not save:
            return _make_error(f'Invalid save: {save_watcher.name()}')
        if empire not in save['snaps'][-1]['empires']:
            return _make_error(f'Empire {empire} not in save {save_watcher.name()}')

        sessions.set_session_empire(request.session['id'], empire)
        return JsonResponse({
            'file': save_watcher.name(),
            'empire': empire,
            'latest_snap': save['snaps'][-1]['empires'][empire]
        })
    except Exception as err:
        return _make_error(f'Bad request body: {repr(err)}')
