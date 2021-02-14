import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import StatsChart from 'Monitor/Charts/StatsChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Colony Stability & Crime';

function ColonyStability(props) {
    const name = props.name ? props.name : 'colonystability';
    const data = props.data;

    const labels = {
        'planets/stability': [
            translate('Min Planet Stability'),
            translate('Max Planet Stability'),
            translate('Average Planet Stability')
        ],
        'planets/crime': [
            translate('Min Planet Crime'),
            translate('Max Planet Crime'),
            translate('Average Planet Crime')
        ]
    };

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Colony Stability & Crime')} titleColor='#96d636'>
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
    ColonyStability,
    'Empire'
);

export default ColonyStability;
