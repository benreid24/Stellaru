import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';

function ColonySizes(props) {
    const name = props.name ? props.name : 'colonysizes';
    const data = props.data;

    const labels = {
        'planets/sizes': ['Min Planet Size', 'Max Planet Size', 'Average Planet Size'],
        'planets/districts': ['Min Planet Districts', 'Max Planet Districts', 'Average Planet Districts'],
        'planets/buildings': ['Min Planet Buildings', 'Max Planet Buildings', 'Average Planet Buildings'],
    };

    return (
        <Chart overlay={props.overlay} title='Colony Sizes &amp; Development' titleColor='#96d636'>
            <StatsChart
                name={name}
                data={data}
                keyPaths={['planets/sizes', 'planets/districts', 'planets/buildings']}
                statLabels={labels}
                exclude={['total']}
            />
        </Chart>
    );
}

registerChart(
    'Colony Sizes',
    'Shows colony sizes, districts, and buildings over time',
    ColonySizes
);

export default ColonySizes;
