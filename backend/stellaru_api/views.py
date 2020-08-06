from datetime import datetime

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from .backend import finder
from .backend import parser

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
        return JsonResponse({'error': repr(err)})
