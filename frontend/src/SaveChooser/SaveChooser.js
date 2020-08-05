import React from 'react';

import {MethodChooser, Methods} from './MethodChooser';
import SaveSelector from './SaveSelector';

import './SaveChooser.css';

const State = Object.freeze({'chooseMethod': 0, 'waitSave': 1, 'chooseSave': 2});

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
            saves: props.saves,
            onChoose: props.onChoose
        };
    }

    methodChose(method) {
        console.log(method);
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
            default:
                console.log('Unknown state: ', method);
                break;
        }
    }

    selectSave(save) {
        this.state.onChoose(save);
    }

    render() {
        return (
            <div className="saveChooser">
                {this.state.state === State.chooseMethod &&
                    <MethodChooser onchoose={(method) => {this.methodChose(method);}}/>
                }
                {this.state.state === State.chooseSave &&
                    <SaveSelector onchoose={(save) => {this.selectSave(save);}} saves={this.state.saves}/>
                }
            </div>
        );
    }
}

export default SaveChooser;