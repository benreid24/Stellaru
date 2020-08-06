import string
import random
import time

sessions = {}
TIMEOUT = 300

SESSION_TEMPLATE = {
    'id': '<session-id>',
    'empire': '<empire_id>',
    'endpoint': '<notification-url',
    'timeout': '<timeout time>'
}

def _get_session_id(session):
    if not isinstance(session, str):
        if 'id' in session:
            return session['id']
        return None
    return session


def register_session(session):
    global sessions
    if 'id' in session:
        if session['id'] in sessions:
            return session['id']

    session_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))
    session_time = time.time()
    sessions[session_id] = {
        'id': session_id,
        'empire': None,
        'time': session_time,
        'endpoint': 'TODO' # TODO - how to do this?
    }
    return session_id


def set_session_empire(session, empire):
    global sessions
    if session in sessions:
        sessions[session]['empire'] = empire


def session_expired(session):
    session = _get_session_id(session)
    if not session:
        return True

    global sessions
    if session not in sessions:
        return True
    if time.time() - sessions[session]['time'] >= TIMEOUT:
        sessions.pop(session)
        return True
    return False


def notify_session(session, payload):
    session = _get_session_id(session)
    if not session:
        return False

    global sessions
    if session not in sessions:
        return False
    if 'empires' in payload:
        if sessions[session]['empire'] in payload['empires']:
            payload = payload['empire'][sessions[session]['empire']]
    # TODO - send payload and reset timer if sent
    sessions[session]['time'] = time.time()
    return True
