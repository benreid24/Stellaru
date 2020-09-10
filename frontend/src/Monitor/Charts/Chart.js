import React from 'react';

import ChartOverlay from './ChartOverlay';

function Chart(props) {
    return (
        <div className='chart'>
            <ChartOverlay settings={props.overlay}/>
            {props.children}
        </div>
    );
}

export default Chart;
