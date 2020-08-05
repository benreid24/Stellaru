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

        let saves = [
            {
                file: 'C:/Steam/saves/ravagers.sav',
                name: 'The Ravisciadian Ravagers',
                fileDate: 'Aug 1 2020',
                fileTime: '10:30 PM', // TODO use datetime and strftime
                gameDate: '2245.2.12'
            },
            {
                file: 'C:/Steam/saves/fellnoli.sav',
                name: 'The Fellnoli Purifiers',
                fileDate: 'Aug 4 2020',
                fileTime: '7:43 PM', // TODO use datetime and strftime
                gameDate: '2345.6.19'
            }
        ]; // TODO- get from backend

        this.state = {
            state: State.chooseSave,
            saves: saves
        };
    }

    onSaveChoose(save) {
        this.setState({
            choosenSave: save,
            state: State.monitor
        });
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
