import React from 'react';

import Chart from '../Chart';
import StatsChart from '../StatsChart';
import {registerChart} from '../../ChartRegistry';
import {selectNested} from '../Util';

function FleetShips(props) {
    const data = props.data;

    const lines = [
        {
            label: 'Fleet Count',
            selector: snap => selectNested('fleets/total', snap)
        },
        {
            label: 'Average Ship Experience',
            selector: snap => selectNested('fleets/avg_ship_exp', snap)
        }
    ];

    return (
        <Chart overlay={props.overlay} title='Fleet Ship Stats' titleColor='#de1212'>
            <StatsChart
                data={data}
                keyPath='fleets/ships'
                extraLines={lines}
                statLabels={['Min Ship Count', 'Max Ship Count', 'Average Ship Count', 'Total Ship Count']}
            />
        </Chart>
    );
}

registerChart(
    'Fleet Ship Stats',
    'Breaks down fleet stats over time',
    FleetShips
);

export default FleetShips;
