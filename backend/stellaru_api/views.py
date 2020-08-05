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
                'time': save.time()
            } for save in save_files
        ]
        saves = [
            {
                'file': save['file'],
                'name': save['meta']['name'],
                'gameDate': save['meta']['date'],
                'fileDatetime': datetime.fromtimestamp(save['time'])
            } for save in saves
        ]
        return JsonResponse({'saves': saves})
    except Exception as err:
        return JsonResponse({'error': repr(err)})
