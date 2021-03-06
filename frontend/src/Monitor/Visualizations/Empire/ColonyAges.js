import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import StatsChart from 'Monitor/Charts/StatsChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Colony Age Stats';

function ColonyAges(props) {
    const name = props.name ? props.name : 'colonyages';
    const data = props.data;

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Colony Age Stats')} titleColor='#96d636'>
            <StatsChart
                name={name}
                data={data}
                keyPaths='planets/age'
                statLabels={[translate('Min Colony Age'), translate('Max Colony Age'), translate('Average Colony Age')]}
                exclude={['total']}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Breaks down fleet stats over time',
    ColonyAges,
    'Empire'
);

export default ColonyAges;
