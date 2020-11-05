import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {objectKeys} from 'Monitor/Charts/Util';
import {translate} from 'Translator';

const Methods = Object.freeze({
    wait: 'wait',
    chooseActive: 'chooseActive',
    chooseExisting: 'chooseExisting',
    latest: 'latest',
    choose: 'choose',
});
const MethodTitles = Object.freeze({
    [Methods.wait]: 'Wait for New Save',
    [Methods.latest]: 'Select Most Recent Save',
    [Methods.choose]: 'Choose Save Manually',
    [Methods.chooseExisting]: 'Choose From Previously Loaded Saves',
    [Methods.chooseActive]: 'Choose From Currently Loaded Saves'
});
const MethodDescs = Object.freeze({
    [Methods.wait]: 'Waits for a new save file to be created then selects it. Also works for resuming existing saves once an autosave occurs',
    [Methods.latest]: 'Selects the most recent save file',
    [Methods.choose]: 'Shows all found saves and allows manual selection',
    [Methods.chooseExisting]: 'Shows saves that have been previously loaded in Stellaru',
    [Methods.chooseActive]: 'Shows saves that are currently running in Stellaru'
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

function MethodChooser(props) {
    const chooseCb = props.onchoose;

    const renderMethod = method => {
        return (
            <div className="row justify-content-center" key={method}>
                <div className="col-xl-5 col-lg-8 col-md-10 col-sm-11 col-xs-12">
                <MethodCard
                    onClick={() => {chooseCb(Methods[method]);}}
                    title={translate(MethodTitles[method])}
                    desc={translate(MethodDescs[method])}
                />
                </div>
            </div>
        );
    }

    const methods = objectKeys(Methods).map(method => renderMethod(method));
    return (
        <div className='container-fluid h-100'>
            <h1 className="saveChooseHeader">{translate('Method for Save Selection')}</h1>
            {methods}
        </div>
    );
}

export {
    Methods,
    MethodChooser
};
