import React from 'react';

import MethodChooser from './MethodChooser';

import './SaveChooser.css';

const State = Object.freeze({'chooseMethod': 0, 'waitSave': 1, 'chooseSave': 2});

class SaveChooser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            state: State.chooseMethod
        };
    }

    methodChose(method) {
        console.log(method);
    }

    render() {
        return (
            <div className="saveChooser">
                {this.state.state === State.chooseMethod && <MethodChooser onchoose={this.methodChose}></MethodChooser>}
                {this.state.state === State.chooseSave && <SaveChooser></SaveChooser>}
            </div>
        );
    }
}

export default SaveChooser;