import React from 'react';

import LineChart from './LineChart';

import {selectNested} from './Util';

function StatsChart(props) {
    const rawData = props.data;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const rightYLabel = props.rightYLabel ? props.rightYLabel : null;
    const keyPaths = Array.isArray(props.keyPaths) ? props.keyPaths : [props.keyPaths];
    const extraLines = props.extraLines ? props.extraLines : [];
    const statLabels = props.statLabels ? props.statLabels : ['Min', 'Max', 'Average', 'Total'];
    const exclude = props.exclude ? props.exclude : [];

    let statLines = [];
    keyPaths.forEach(keyPath => {
        const labels = Array.isArray(statLabels) ? statLabels : statLabels[keyPath];
        const lkey = ['min', 'max', 'avg', 'total'];
        labels.forEach((label, i) => {
            if (!exclude.includes(lkey[i])) {
                statLines.push({
                    label: label,
                    selector: snap => selectNested(`${keyPath}/${lkey[i]}`, snap)
                });
            }
        });
    });
    const lines = [...extraLines, ...statLines];

    return <LineChart data={rawData} yAxisLabel={yLabel} rightYLabel={rightYLabel} lines={lines}/>;
}

export default StatsChart;
