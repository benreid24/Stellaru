import React, {useState} from 'react';

import ChartOverlay from './ChartOverlay';
import {addChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

import './Charts.css';

function AddOverlay(props) {
    const name = props.name;
    const [visible, setVisible] = useState(false);
    const [added, setAdded] = useState(false);

    const onClick = () => {
        if (!added) {
            addChart(name);
            setAdded(true);
        }
    };

    const onLeave = () => {
        setVisible(false);
        setAdded(false);
    };

    if (!visible) {
        return (
            <div
                className='chartOverlayTriggerArea'
                onClick={() => setVisible(true)}>
                <h1 className='chartOverlayDots noselect'>...</h1>
            </div>
        );
    }

    return (
        <div className='defaultChartOverlay' onMouseLeave={onLeave} onClick={onClick}>
            {!added && <p className='addToDashboardText noselect'>{translate('Add to custom dashboard')}</p>}
            {added && <p className='addedToDashText noselect'>{translate('Added')}</p>}
        </div>
    );
}

function Chart(props) {
    const name = props.name;
    const color = props.titleColor ? props.titleColor : 'white';

    const renderOverlay = () => {
        return props.overlay ? <ChartOverlay settings={props.overlay}/> : <AddOverlay name={name}/>;
    };

    return (
        <div className='chart'>
            {props.title && <h2 className='chartTitle' style={{color: color}}>{props.title}</h2>}
            {renderOverlay()}
            {props.children}
        </div>
    );
}

export default Chart;
