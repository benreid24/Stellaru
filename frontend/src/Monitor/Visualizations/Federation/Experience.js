import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Federation Experience';

function FederationExperience(props) {
    const name = props.name ? props.name : 'FederationExperience';
    const data = props.data;

    const lines = [
        {
            label: translate('Experience'),
            selector: snap => selectNested('federation/xp', snap),
        },
        {
            label: translate('Level'),
            selector: snap => selectNested('federation/level', snap),
            yAxis: 'right'
        }
    ];

    const fedName = data.length > 0 ? selectNested('federation/name', data[data.length-1]) : 'Federation';

    return (
        <Chart name={Name} overlay={props.overlay} title={fedName + ' ' + translate('Experience')} titleColor='#127814'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel={translate('Experience')}
                rightYLabel={translate('Level')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows federation experience and level over time',
    FederationExperience,
    'Federation'
);

export default FederationExperience;
