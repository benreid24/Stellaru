from cx_Freeze import setup, Executable
import sys

PYTHON_INSTALL_DIR = sys.exec_prefix

outfile = 'Stellaru'
if sys.platform == "win32":
    outfile = 'Stellaru.exe'

executables = [Executable("main.py", target_name=outfile)]

packages = [
    # From requirements.txt
    'altgraph',
    'asgiref',
    'certifi',
    'channels',
    'chardet',
    'constantly',
    'django',
    'future',
    'hyperlink',
    'idna',
    'incremental',
    'lief',
    'packaging',
    'pefile',
    'pyasn1',
    'pycparser',
    'pyparsing',
    'pytz',
    'requests',
    'six',
    'sqlparse',
    'txaio',
    'urllib3',
    'xdg',
    'zipp',
    'zope.interface',

    # Stellaru
    'stellaru',
    'stellaru_api',
    'engine',
]
options = {
    'build_exe': {
        'packages': packages,
        'build_exe': './build'
    },
}

setup(
    name="Stellaru",
    options=options,
    version="1.0",
    description='Stellaris data dashboard',
    executables=executables
)
