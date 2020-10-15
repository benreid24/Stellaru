# Imports for compilation only
import channels.apps
import stellaru_api.urls

import functools
import os
import socket
import threading
import webbrowser
import time
from contextlib import closing

from daphne.server import Server
import django
from daphne.endpoints import build_endpoint_description_strings
from channels.staticfiles import StaticFilesWrapper

from stellaru import settings_release

DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 42069


def port_open(port):
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        return sock.connect_ex(('localhost', port)) != 0


def find_port():
    if port_open(DEFAULT_PORT):
        return DEFAULT_PORT
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("",0))
    port = s.getsockname()[1]
    s.close()
    return port


def open_browser(port):
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{port}', 2, True)


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "stellaru.settings_release")
    django.setup()
    django.core.management.call_command("makemigrations")
    django.core.management.call_command("migrate")

    port = find_port()
    from stellaru import routing as stellaru_app
    application = StaticFilesWrapper(stellaru_app.application)
    endpoints = build_endpoint_description_strings(
        host=DEFAULT_HOST,
        port=port,
        unix_socket=None,
        file_descriptor=None,
    )
    server = Server(application=application, endpoints=endpoints, server_name='Stellaru')

    print('Starting Stellaru')
    thread = threading.Thread(target=open_browser, args=(port,))
    thread.run()
    server.run()


if __name__ == '__main__':
    main()
