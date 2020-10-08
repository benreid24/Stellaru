import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';

function ColonyAges(props) {
    const data = props.data;

    return (
        <Chart overlay={props.overlay} title='Colony Age Stats' titleColor='#96d636'>
            <StatsChart
                name='colonyages'
                data={data}
                keyPaths='planets/age'
                statLabels={['Min Colony Age', 'Max Colony Age', 'Average Colony Age']}
                exclude={['total']}
            />
        </Chart>
    );
}

registerChart(
    'Colony Age Stats',
    'Breaks down fleet stats over time',
    ColonyAges
);

export default ColonyAges;
