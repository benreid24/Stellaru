import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from '../../Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Federation Members';

function FederationMembers(props) {
    const name = props.name ? props.name : 'FederationMembers';
    const data = props.data;

    const lines = [
        {
            label: translate('Member Count'),
            selector: snap => selectNested('federation/members', snap),
        },
        {
            label: translate('Cohesion'),
            selector: snap => selectNested('federation/cohesion', snap),
            yAxis: 'right'
        }
    ];

    const fedName = data.length > 0 ? selectNested('federation/name', data[data.length-1]) : 'Federation';

    return (
        <Chart name={Name} overlay={props.overlay} title={fedName + ' ' + translate('Members')} titleColor='#127814'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel={translate('Members')}
                rightYLabel={translate('Cohesion')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows federation member count and cohesion over time',
    FederationMembers
);

export default FederationMembers;
