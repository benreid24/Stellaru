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
const MaxRetries = 3;
const ConnectTimeout = 5000; // ms
const PollInterval = 30000;

function getSubscriptionUrl() {
    if (process.env.NODE_ENV === 'development')
        return 'ws://localhost:8000/api/subscribe';
    let url = 'ws:';
    const location = window.location;
    if (location.protocol === 'https:')
        url = 'wss:';
    url += `//${location.host}${location.pathname}api/subscribe`;
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
            this.heartbeatTime = Date.now();
            this.socketRetries = 0;
            this.socket.onopen = () => this.onOpen(this);
            this.socket.onerror = () => {
                setTimeout(() => this.tryReconnect(this), ConnectTimeout);
            };
            setTimeout(() => this.checkHeartbeat(this), 5000);
        }
        else {
            this.setupPolling();
        }
    }

    checkHeartbeat(me) {
        if (me.connected) {
            if (Date.now() - me.heartbeatTime > 5000) {
                me.resubscribe(me);
            }
        }
        setTimeout(() => this.checkHeartbeat(me), 5000);
    }

    setChosenInfo(save, empire) {
        this.save = save;
        this.empire = empire;
    }

    setupPolling() {
        this.method = ConnectionMethod.Poll;
        this.setStatus(Status.WaitingPolling);
        this.onPoll();
    }

    onPoll() {
        if (this.status === Status.Polling) {
            setTimeout(() => this.onPoll(), PollInterval);
            return;
        }
        this.setStatus(Status.Polling);

        if (this.save && !isNaN(this.empire)) {
            try {
                fetch(
                    window.location.pathname + 'api/latest_snap', {
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({file: this.save, empire: this.empire})
                    }
                ).then(response => {
                    return response.ok ? response.json() : null;
                }).then(data => {
                    if (data) {
                        this.processData({snap: data.latest_snap});
                        this.setStatus(Status.WaitingPolling);
                    }
                    else {
                        this.setStatus(Status.Disconnected);
                    }
                });
            } catch (_) {
                this.setStatus(Status.Disconnected);
            }
        }
        else {
            this.setStatus(Status.WaitingPolling);
        }

        setTimeout(() => this.onPoll(), PollInterval);
    }

    resubscribe(me) {
        me.socket.send(JSON.stringify({
            subscribe: {
                file: me.save,
                empire: me.empire
            }
        }));
    }

    onOpen(me) {
        console.log('Subscribed to backend updates');
        me.socket.send('{"message": "Frontend connected"}');
        me.setStatus(Status.WaitingSocket);
        me.connected = true;
        me.socketRetries = 0;
        me.socket.onclose = () => me.tryReconnect(me);
        me.socket.onmessage = event => me.onData(me, event);
        if (me.save && !isNaN(me.empire)) {
            me.resubscribe(me);
        }
    }

    tryReconnect(me) {
        me.socketRetries += 1;
        if (me.socketRetries <= MaxRetries) {
            me.socket = new WebSocket(getSubscriptionUrl());
            me.setStatus(`${Status.Reconnecting} (retry ${me.socketRetries})`);
            me.connected = false;
            me.socket.onopen = () => me.onOpen(me);
            me.socket.onerror = () => {
                setTimeout(() => me.tryReconnect(me), ConnectTimeout);
            };
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
            if (!payload['status'].includes('WAITING')) {
                console.log(payload['status']);
                this.setStatus(payload['status']);
            }
        }
    }

    onData(me, event) {
        me.heartbeatTime = Date.now();
        me.processData(JSON.parse(event.data));
    }
}

export default DataSubscription;
