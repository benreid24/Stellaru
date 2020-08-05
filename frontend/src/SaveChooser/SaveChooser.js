import React from 'react';

import {MethodChooser, Methods} from './MethodChooser';
import SaveSelector from './SaveSelector';

import './SaveChooser.css';

const State = Object.freeze({'chooseMethod': 0, 'waitSave': 1, 'chooseSave': 2});

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
                this.selectSave(this.state.saves[0]); // TODO - order by datetime
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