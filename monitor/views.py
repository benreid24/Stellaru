from django.shortcuts import render
from django.http import HttpResponse


def choose_save(request):
    context = {}
    return render(request, 'monitor/save_chooser.html', context)


def monitor(request):
    context = {
        'game_name': 'The Felnolli Purifiers'
    }
    return render(request, 'monitor/monitor.html', context)
