import React, {useState, useEffect} from 'react';
import {createMuiTheme} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core'

import './Stellaru.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SaveChooser from './SaveChooser/SaveChooser';
import EmpireChooser from './EmpireChooser/EmpireChooser';
import Monitor from './Monitor/Monitor';

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

const State = Object.freeze({
    chooseSave: 0,
    chooseEmpire: 1,
    monitor: 2
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

function Stellaru(props) {
    const [state, setState] = useState(State.chooseSave);
    const [chosenSave, setChosenSave] = useState(null);
    const [chosenEmpire, setChosenEmpire] = useState(null);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(getSubscriptionUrl());
        socket.onopen = () => {
            console.log('Subscribed to backend updates');
            socket.send('{"message": "Frontend connected"}');
            setSubscription(socket);
        }
    }, []);

    const onSaveChoose = (save) => {
        setState(State.chooseEmpire);
        setChosenSave(save);
    };

    const onEmpireChoose = (empire) => {
        setChosenEmpire(empire);
        setState(State.monitor);
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="Stellaru">
                {state === State.chooseSave && <SaveChooser onChoose={onSaveChoose}/>}
                {state === State.chooseEmpire && <EmpireChooser file={chosenSave.file} onChoose={onEmpireChoose}/>}
                {state === State.monitor && <Monitor save={chosenSave} empire={chosenEmpire} socket={subscription}/>}
            </div>
        </ThemeProvider>
    );
}

export default Stellaru;
