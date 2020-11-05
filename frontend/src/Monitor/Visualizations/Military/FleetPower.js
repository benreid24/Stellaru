import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import StatsChart from '../../Charts/StatsChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Fleet Power';

function FleetPower(props) {
    const name = props.name ? props.name : 'fleetpower';
    const data = props.data;

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Fleet Power')} titleColor='#de1212'>
            <StatsChart
                name={name}
                data={data}
                keyPaths='fleets/fleet_power'
                statLabels={[
                    translate('Min Power/Fleet'),
                    translate('Max Power/Fleet'),
                    translate('Average Power/Fleet'),
                    translate('Total Fleet Power')
                ]}
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
