import React from 'react';

import ChartOverlay from './ChartOverlay';

import './Charts.css';

function Chart(props) {
    const color = props.titleColor ? props.titleColor : 'white';
    return (
        <div className='chart'>
            {props.title && <h2 className='chartTitle' style={{color: color}}>{props.title}</h2>}
            <ChartOverlay settings={props.overlay}/>
            {props.children}
        </div>
    );
}

export default Chart;
