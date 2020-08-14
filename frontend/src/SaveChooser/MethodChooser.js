import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const Methods = Object.freeze({wait: 'wait', choose: 'choose', chooseExisting: 'chooseExisting', latest: 'latest'});
const MethodTitles = Object.freeze({
    [Methods.wait]: 'Wait for New Save',
    [Methods.latest]: 'Select Most Recent Save',
    [Methods.choose]: 'Choose Save Manually',
    [Methods.chooseExisting]: 'Choose Previous Saves'
});
const MethodDescs = Object.freeze({
    [Methods.wait]: 'Waits for a new save file to be created then selects it. Also works for resuming existing saves once an autosave occurs',
    [Methods.latest]: 'Selects the most recent save file',
    [Methods.choose]: 'Shows all found saves and allows manual selection',
    [Methods.chooseExisting]: 'Shows saves that have been previously loaded in Stellaru'
});

function MethodCard(props) {
    return (
        <Card className="saveCardDiv" onClick={props.onClick}>
            <CardContent style={{textAlign: "center"}}>
                <h2 className="methodName noselect">{props.title}</h2>
                <p className="noselect">{props.desc}</p>
            </CardContent>
        </Card>
    );
}

class MethodChooser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chooseCb: props.onchoose
        };
    }

    renderMethod(method) {
        return (
            <div className="row" key={method}>
                <div className="col-4"></div>
                <div className="col-4">
                <MethodCard
                    onClick={() => {this.state.chooseCb(Methods[method]);}}
                    title={MethodTitles[method]}
                    desc={MethodDescs[method]}
                />
                </div>
            </div>
        );
    }

    render() {
        let methods = [];
        for (let method in Methods) {
            methods.push(this.renderMethod(method));
        }
        return (
            <div>
                <h1 className="saveChooseHeader">Method for Save Selection</h1>
                {methods}
            </div>
        );
    }
}

export {
    Methods,
    MethodChooser
};
