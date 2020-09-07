import React from 'react';

import {MethodChooser, Methods} from './MethodChooser';
import SaveSelector from './SaveSelector';
import SaveWaiter from './SaveWaiter';

import './SaveChooser.css';

const State = Object.freeze({chooseMethod: 0, waitSave: 1, chooseSave: 2, choosePrevSave: 3});
// TODO - support showing saves currently being watched

function selectLatestSave(saves) {
    let ld = saves[0].fileDatetime;
    let ls = saves[0];
    for (let i = 1; i<saves.length; i += 1) {
        if (saves[i].fileDatetime > ld) {
            ld = saves[i].fileDatetime;
            ls = saves[i];
        }
    }
    return ls;
}

class SaveChooser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            state: State.chooseMethod,
            saves: [],
            onChoose: props.onChoose,
            error: null
        };
    }

    componentDidMount() {
        fetch('api/saves')
            .then(response => response.json())
            .then(data => {
                if ('saves' in data) {
                    const saves = data['saves'];
                    for (let i = 0; i<saves.length; i += 1) {
                        saves[i].fileDatetime = new Date(saves[i].fileDatetime);
                    }
                    saves.sort((a,b) => {
                        if (a.fileDatetime < b.fileDatetime)
                            return 1;
                        if (a.fileDatetime > b.fileDatetime)
                            return -1;
                        return 0;
                    });
                    this.setState({
                        state: this.state.state,
                        saves: saves
                    });
                }
                else {
                    this.setState({
                        error: data['error']
                    });
                }
            });
    }

    methodChose(method) {
        switch (method) {
            case Methods.wait:
                this.setState({state: State.waitSave});
                break;
            case Methods.choose:
                this.setState({state: State.chooseSave});
                break;
            case Methods.latest:
                this.selectSave(selectLatestSave(this.state.saves));
                break;
            case Methods.chooseExisting:
                this.setState({state: State.choosePrevSave});
                break;
            default:
                console.log('Unknown state: ', method);
                break;
        }
    }

    selectSave(save) {
        this.state.onChoose(save);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="saveChooser">
                    <h1 class='error'>Error</h1>
                    <p class='error'>{this.state.error}</p>
                </div>
            );
        }

        return (
            <div className="saveChooser">
                {this.state.state === State.chooseMethod &&
                    <MethodChooser onchoose={(method) => {this.methodChose(method);}}/>
                }
                {(this.state.state === State.chooseSave || this.state.state === State.choosePrevSave) &&
                    <SaveSelector
                        onchoose={(save) => {this.selectSave(save);}}
                        saves={this.state.saves}
                        prevOnly={this.state.state === State.choosePrevSave}
                    />
                }
                {this.state.state === State.waitSave &&
                    <SaveWaiter onSave={save => this.selectSave(save)}/>
                }
            </div>
        );
    }
}

export default SaveChooser;