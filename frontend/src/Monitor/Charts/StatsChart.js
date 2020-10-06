import React from 'react';

import LineChart from './LineChart';

import {selectNested} from './Util';

function StatsChart(props) {
    const rawData = props.data;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const keyPath = props.keyPath;
    const extraLines = props.extraLines ? props.extraLines : [];
    const statLabels = props.statLabels ? props.statLabels : ['Min', 'Max', 'Average', 'Total'];
    const lines = [
        ...extraLines,
        {
            label: statLabels[0],
            selector: snap => selectNested(keyPath+'/min', snap)
        },
        {
            label: statLabels[1],
            selector: snap => selectNested(keyPath+'/max', snap)
        },
        {
            label: statLabels[2],
            selector: snap => selectNested(keyPath+'/avg', snap)
        },
        {
            label: statLabels[3],
            selector: snap => selectNested(keyPath+'/total', snap)
        }
    ];

    return <LineChart data={rawData} yLabel={yLabel} lines={lines}/>;
}

export default StatsChart;
