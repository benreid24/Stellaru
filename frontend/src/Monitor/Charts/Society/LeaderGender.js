import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function LeaderGender(props) {
    const data = props.data;

    const areas = [
        {
            label: 'Percent Male',
            selector: snap => selectNested('leaders/percent_male', snap) * 100
        },
        {
            label: 'Percent Female',
            selector: snap => (1 - selectNested('leaders/percent_male', snap)) * 100
        }
    ];

    return (
        <Chart overlay={props.overlay} title='Leader Gender Breakdown' titleColor='#65c73c'>
            <AreaChart
                data={data}
                allowIsolation={true}
                stack={true}
                areas={areas}
            />
        </Chart>
    );
}

registerChart(
    'Leader Gender Breakdown',
    'Shows gender breakdown over time',
    LeaderGender
);

export default LeaderGender;
