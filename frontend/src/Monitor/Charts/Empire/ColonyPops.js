import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';

function ColonyPops(props) {
    const data = props.data;

    const labels = {
        'planets/pops': ['Min Planet Population', 'Max Planet Population', 'Average Planet Population'],
        'planets/housing': ['Min Planet Housing', 'Max Planet Housing', 'Average Planet Housing']
    };

    return (
        <Chart overlay={props.overlay} title='Colony Population &amp; Housing' titleColor='#96d636'>
            <StatsChart
                data={data}
                keyPaths={['planets/pops', 'planets/housing']}
                statLabels={labels}
                exclude={['total']}
            />
        </Chart>
    );
}

registerChart(
    'Colony Popultation & Housing',
    'Shows colony population and housing stats over time',
    ColonyPops
);

export default ColonyPops;
