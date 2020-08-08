import React from 'react';
import {createMuiTheme} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SaveChooser from './SaveChooser/SaveChooser';
import EmpireChooser from './EmpireChooser/EmpireChooser';

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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: State.chooseSave,
        };
    }

    onSaveChoose(save) {
        this.setState({
            chosenSave: save,
            state: State.chooseEmpire
        });
    }

    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <div className="App">
                    {this.state.state === State.chooseSave && 
                        <SaveChooser saves={this.state.saves} onChoose={(save) => {this.onSaveChoose(save);}}/>
                    }
                    {this.state.state === State.chooseEmpire && <EmpireChooser file={this.state.chosenSave}/>}
                    {this.state.state === State.monitor && <p>Watching save: {this.state.choosenSave.name}</p>}
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
