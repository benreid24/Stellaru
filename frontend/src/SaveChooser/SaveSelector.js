import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BackButton from './BackButton';
import LoadingDots from '../LoadingDots';

const TimeConfig = Object.freeze({hour: 'numeric', minute: 'numeric', hour12: true});

function SaveCard(props) {
    const save = props.save;
    const onClick = props.onClick;
    let nameClass = 'noselect';
    if (props.save.active)
        nameClass += ' activeSaveName';
    else if (props.save.history)
        nameClass += ' historySaveName';
    else
        nameClass += ' saveName';
    return (
        <Card className="saveCardDiv" onClick={onClick}>
            <CardContent>
                <h2 className={nameClass}>{save.name}</h2>
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

function Legend(props) {
    return (
        <div className='saveLegend'>
            <h2 className='saveLegendTitle'>Legend</h2>
            <div className='saveLegendItems'>
                <h3 className='activeSaveName'>Running Save</h3>
                <h3 className='historySaveName'>Previously Loaded Save</h3>
                <h3 className='saveName'>Regular Save</h3>
            </div>
        </div>
    );
}

function SaveSelector(props) {
    const onBack = props.onBack;

    let saveCards = [];
    for (let i = 0; i<props.saves.length; i += 1) {
        const save = props.saves[i];
        if (props.prevOnly && !save.history)
            continue;
        if (props.activeOnly && !save.active)
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

    if (props.saves.length === 0) {
        return (
            <div className='container-fluid h-100'>
                <BackButton onClick={onBack}/>
                <h1 className="saveChooseHeader">Choose Game Save</h1>
                <p>Finding saves<LoadingDots/></p>
            </div>
        );
    }

    return (
        <div className='container-fluid h-100'>
            <BackButton onClick={onBack}/>
            <h1 className="saveChooseHeader">Choose Game Save</h1>
            {!props.prevOnly && !props.activeOnly && <Legend/>}
            <div className="row justify-content-center">
                {saveCards}
            </div>
        </div>
    );
}

export default SaveSelector;
