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
    'attrs',
    'autobahn',
    'certifi',
    'cffi',
    'channels',
    'chardet',
    'constantly',
    'cryptography',
    'cx_Freeze',
    'daphne',
    'django',
    'future',
    'hyperlink',
    'idna',
    'importlib_metadata',
    'incremental',
    'lief',
    'packaging',
    'pefile',
    'pyasn1',
    'pyasn1_modules',
    'pycparser',
    'pyparsing',
    'pytz',
    'requests',
    'six',
    'sqlparse',
    'tomli',
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
