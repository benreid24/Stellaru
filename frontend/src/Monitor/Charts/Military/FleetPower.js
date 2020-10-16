import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';

const Name = 'Fleet Power';

function FleetPower(props) {
    const name = props.name ? props.name : 'fleetpower';
    const data = props.data;

    return (
        <Chart name={Name} overlay={props.overlay} title='Fleet Power' titleColor='#de1212'>
            <StatsChart
                name={name}
                data={data}
                keyPaths='fleets/fleet_power'
                statLabels={['Min Power/Fleet', 'Max Power/Fleet', 'Average Power/Fleet', 'Total Fleet Power']}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows total fleet power over time with fleet stats',
    FleetPower
);

export default FleetPower;
