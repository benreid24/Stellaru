import string
import random

sessions = {}


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
    sessions[session_id] = {
        'id': session_id,
        'empire': None,
        'socket': None
    }
    session['id'] = session_id
    return session_id


def set_session_empire(session, empire):
    global sessions
    if session in sessions:
        sessions[session]['empire'] = empire

    
def set_session_socket(session, socket):
    global sessions
    if session in sessions:
        sessions[session]['socket'] = socket
    else:
        sessions[session] = {
            'id': session,
            'socket': socket,
            'empire': None
        }


def clear_session(session):
    global sessions
    if session in sessions:
        sessions.pop(session)


def session_expired(session):
    session = _get_session_id(session)
    if not session:
        return True

    if session not in sessions:
        return True
    return False


def notify_session(session, payload):
    session = _get_session_id(session)
    if not session:
        return False

    global sessions
    if session not in sessions:
        return False
    if not sessions[session]['socket']:
        return False
    if 'empires' in payload:
        if sessions[session]['empire'] in payload['empires']:
            payload = {
                'snap': payload['empires'][sessions[session]['empire']]
            }
    sessions[session]['socket'].send_json(payload)
    return True
