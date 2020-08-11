import React, {useState} from 'react';

import {VictoryLine} from 'victory';
import {Chart} from './Charts';

import './Charts.css';

function StellaruLines(props) {
    const [data, setData] = useState([
        {x: 1, y: 5},
        {x: 2, y: 7},
        {x: 3, y: 12},
        {x: 4, y: 25},
        {x: 5, y: 59},
    ]);

    return (
        <Chart width='100%' height={300}>
            <VictoryLine style={{data: {stroke: '#aa5522'}}} data={data}/>
        </Chart>
    );
}

export default StellaruLines;
