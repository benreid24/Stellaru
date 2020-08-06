import React from 'react';
import {createMuiTheme} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SaveChooser from './SaveChooser/SaveChooser';

const State = Object.freeze({
    chooseSave: 0,
    monitor: 1
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
            choosenSave: save,
            state: State.monitor
        });
        fetch(
            'api/empires', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({file: save.file, test: 'value'})
            }
        ).then(response => response.json()).then(data => console.log(data));
    }

    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <div className="App">
                    {this.state.state === State.chooseSave && 
                        <SaveChooser saves={this.state.saves} onChoose={(save) => {this.onSaveChoose(save);}}/>
                    }
                    {this.state.state === State.monitor && <p>Watching save: {this.state.choosenSave.name}</p>}
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
