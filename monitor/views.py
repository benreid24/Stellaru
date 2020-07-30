from django.shortcuts import render
from django.http import HttpResponse


def choose_save(request):
    return HttpResponse("Display game saves here")
