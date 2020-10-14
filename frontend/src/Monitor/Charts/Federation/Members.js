import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function FederationMembers(props) {
    const name = props.name ? props.name : 'FederationMembers';
    const data = props.data;

    const lines = [
        {
            label: 'Member Count',
            selector: snap => selectNested('federation/members', snap),
        },
        {
            label: 'Cohesion',
            selector: snap => selectNested('federation/cohesion', snap),
            yAxis: 'right'
        }
    ];

    const fedName = data.length > 0 ? selectNested('federation/name', data[data.length-1]) : 'Federation';

    return (
        <Chart overlay={props.overlay} title={`${fedName} Members`} titleColor='#127814'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel='Members'
                rightYLabel='Cohesion'
            />
        </Chart>
    );
}

registerChart(
    'Federation Members',
    'Shows federation member count and cohesion over time',
    FederationMembers
);

export default FederationMembers;
