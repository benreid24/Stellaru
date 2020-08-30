import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const TimeConfig = Object.freeze({hour: 'numeric', minute: 'numeric', hour12: true});

function SaveCard(props) {
    const save = props.save;
    const onClick = props.onClick;
    return (
        <Card className="saveCardDiv" onClick={onClick}>
            <CardContent>
                <h2 className="saveName noselect">{save.name}</h2>
                    <div className="saveCardBottomDiv">
                        <p className="saveGameDate noselect">{save.gameDate}</p>
                        <p className="saveFileDatetime noselect">
                            <span className="saveFileDate">{save.fileDatetime.toDateString()}</span>
                            <span className="saveFileTime">{save.fileDatetime.toLocaleString('en-US', TimeConfig)}</span>
                        </p>
                    </div>
            </CardContent>
        </Card>
    );
}

function SaveSelector(props) {
    let saveCards = [];
    for (let i = 0; i<props.saves.length; i += 1) {
        const save = props.saves[i];
        if (props.prevOnly && !save.history)
            continue;
        saveCards.push(
            <div
                className="col-xl-3 col-lg-4 col-md-6 col-xs-10 mb-3"
                key={save.name+save.gameDate}
            >
                <SaveCard save={save} onClick={() => {props.onchoose(save);}}/>
            </div>
        );
    }

    return (
        <div className='container-fluid h-100'>
            <h1 className="saveChooseHeader">Choose Game Save</h1>
            <div className="row justify-content-center">
                {saveCards}
            </div>
        </div>
    );
}

export default SaveSelector;
