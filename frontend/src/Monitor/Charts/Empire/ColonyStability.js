import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';

const Name = 'Colony Stability & Crime';

function ColonyStability(props) {
    const name = props.name ? props.name : 'colonystability';
    const data = props.data;

    const labels = {
        'planets/stability': ['Min Planet Stability', 'Max Planet Stability', 'Average Planet Stability'],
        'planets/crime': ['Min Planet Crime', 'Max Planet Crime', 'Average Planet Crime']
    };

    return (
        <Chart name={Name} overlay={props.overlay} title='Colony Stability &amp; Crime' titleColor='#96d636'>
            <StatsChart
                name={name}
                data={data}
                keyPaths={['planets/stability', 'planets/crime']}
                statLabels={labels}
                exclude={['total']}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows colony stability and crime over time',
    ColonyStability
);

export default ColonyStability;
