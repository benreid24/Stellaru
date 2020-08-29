const ConnectionMethod = Object.freeze({Socket: 0, Poll: 1});
const Status = Object.freeze({
    Connecting: 'Connecting',
    Reconnecting: 'Reconnecting',
    WaitingSocket: 'Waiting (Connected)',
    WaitingPolling: 'Waiting (Polling)',
    Polling: 'Polling',
    Loading: 'Loading',
    Disconnected: 'Disconnected'
});
const MaxRetries = 5;
const ConnectTimeout = 30000; // ms

function getSubscriptionUrl() {
    if (process.env.NODE_ENV === 'development')
        return 'ws://localhost:8000/api/subscribe';
    let url;
    const location = window.location;
    if (location.protocol === 'https:')
        url = 'wss:';
    else
        url = 'ws:';
    url += `//${location.host}/api/subscribe`;
    return url;
}

function websocketsSupported() {
    return 'WebSocket' in window || 'MozWebSocket' in window;
}

class DataSubscription {
    constructor() {
        if (websocketsSupported()) {
            this.socket = new WebSocket(getSubscriptionUrl());
            this.setStatus(Status.Connecting);
            this.method = ConnectionMethod.Socket;
            this.connected = false;
            this.socketRetries = 0;
            this.socket.onopen = () => this.onOpen(this);
            setTimeout(() => {
                if (this.status === Status.Connecting) {
                    this.setupPolling();
                }
            }, ConnectTimeout);
        }
        else {
            this.setupPolling();
        }
    }

    setupPolling() {
        this.setStatus(Status.WaitingPolling);
        // TODO - setup polling
    }

    onOpen(me) {
        console.log('Subscribed to backend updates');
        me.socket.send('{"message": "Frontend connected"}');
        me.setStatus(Status.WaitingSocket);
        me.connected = true;
        me.socketRetries = 0;
        me.socket.onclose = () => this.tryReconnect(this);
        me.socket.onerror = () => this.tryReconnect(this);
        me.socket.onmessage = event => this.onData(me, event);
    }

    tryReconnect(me) {
        me.socketRetries += 1;
        if (me.socketRetries <= MaxRetries) {
            me.socket = new WebSocket(getSubscriptionUrl());
            me.setStatus(`${Status.Reconnecting} (try ${me.socketRetries})`);
            me.connected = false;
            me.socket.onopen =() => me.onOpen(me);
            setTimeout(() => {
                if (me.status === Status.Reconnecting) {
                    me.tryReconnect(me);
                }
            }, ConnectTimeout);
        }
        else {
            me.setupPolling();
        }
    }

    setStatus(status) {
        this.status = status;
        if (this.onStatus) {
            this.onStatus(status);
        }
    }

    processData(payload) {
        if ('snap' in payload) {
            if (this.onSnap) {
                this.onSnap(payload['snap']);
            }
            this.setStatus(Status.WaitingSocket);
        }
        else if ('status' in payload) {
            if (payload['status'] !== 'Waiting')
                this.setStatus(payload['status']);
        }
    }

    onData(me, event) {
        me.processData(JSON.parse(event.data));
    }
}

export default DataSubscription;
