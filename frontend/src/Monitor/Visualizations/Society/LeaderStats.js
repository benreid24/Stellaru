import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from '../../Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Leader Stats';

function LeaderStats(props) {
    const name = props.name ? props.name : 'leaderstats';
    const data = props.data;

    const lines = [
        {
            label: translate('Average Age'),
            selector: snap => selectNested('leaders/avg_age', snap)
        },
        {
            label: translate('Average Hire Age'),
            selector: snap => selectNested('leaders/avg_hire_age', snap)
        },
        {
            label: translate('Max Age'),
            selector: snap => selectNested('leaders/max_age', snap)
        },
        {
            label: translate('Max Hire Age'),
            selector: snap => selectNested('leaders/max_hire_age', snap)
        },
        {
            label: translate('Average Level'),
            selector: snap => selectNested('leaders/avg_level', snap),
            yAxis: 'right'
        },
        {
            label: translate('Max Level'),
            selector: snap => selectNested('leaders/max_level', snap),
            yAxis: 'right'
        },
    ];

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Leader Stats')} titleColor='#65c73c'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel={translate('Age')}
                rightYLabel={translate('Level')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows leader ages and levels over time',
    LeaderStats
);

export default LeaderStats;
