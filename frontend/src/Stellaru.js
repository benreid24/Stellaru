import React, {useState} from 'react';
import {createMuiTheme} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core'

import './Stellaru.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DataSubscription from './DataSubscription';
import SaveChooser from './SaveChooser/SaveChooser';
import EmpireChooser from './EmpireChooser/EmpireChooser';
import Monitor from './Monitor/Monitor';

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

const subscription = new DataSubscription();

function Stellaru(props) {
    const [state, setState] = useState(State.chooseSave);
    const [chosenSave, setChosenSave] = useState(null);
    const [chosenEmpire, setChosenEmpire] = useState(null);

    const onSaveChoose = (save) => {
        setState(State.chooseEmpire);
        setChosenSave(save);
    };

    const onEmpireChoose = (empire) => {
        setChosenEmpire(empire);
        setState(State.monitor);
        subscription.setChosenInfo(chosenSave.file, empire.id);
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="Stellaru">
                {state === State.chooseSave && <SaveChooser onChoose={onSaveChoose}/>}
                {state === State.chooseEmpire && <EmpireChooser file={chosenSave.file} onChoose={onEmpireChoose}/>}
                {state === State.monitor && <Monitor save={chosenSave} empire={chosenEmpire} subscription={subscription}/>}
            </div>
        </ThemeProvider>
    );
}

export default Stellaru;
