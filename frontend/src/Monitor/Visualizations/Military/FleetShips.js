import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import StatsChart from '../../Charts/StatsChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {selectNested} from '../../Charts/Util';
import {translate} from 'Translator';

const Name = 'Fleet Ship Stats';

function FleetShips(props) {
    const name = props.name ? props.name : 'fleetships';
    const data = props.data;

    const lines = [
        {
            label: translate('Fleet Count'),
            selector: snap => selectNested('fleets/total', snap)
        },
        {
            label: translate('Average Ship Experience'),
            selector: snap => selectNested('fleets/avg_ship_exp', snap),
            yAxis: 'right'
        }
    ];

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Fleet Ship Stats')} titleColor='#de1212'>
            <StatsChart
                name={name}
                data={data}
                keyPaths='fleets/ships'
                extraLines={lines}
                statLabels={[
                    translate('Min Ship Count'),
                    translate('Max Ship Count'),
                    translate('Average Ship Count'),
                    translate('Total Ship Count')
                ]}
                yAxisLabel={translate('Ship Count')}
                rightYLabel={translate('Experience')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Breaks down fleet stats over time',
    FleetShips
);

export default FleetShips;
