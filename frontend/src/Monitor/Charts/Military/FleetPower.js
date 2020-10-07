import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';

function FleetPower(props) {
    const data = props.data;

    return (
        <Chart overlay={props.overlay} title='Fleet Power' titleColor='#de1212'>
            <StatsChart
                data={data}
                keyPaths='fleets/fleet_power'
                statLabels={['Min Power/Fleet', 'Max Power/Fleet', 'Average Power/Fleet', 'Total Fleet Power']}
            />
        </Chart>
    );
}

registerChart(
    'Fleet Power',
    'Shows total fleet power over time with fleet stats',
    FleetPower
);

export default FleetPower;
