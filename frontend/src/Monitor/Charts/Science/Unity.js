import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Unity(props) {
    const name = props.name ? props.name : 'unity';
    const data = props.data;

    const lines = [
        {
            label: 'Unity Income',
            selector: snap => selectNested('economy/income/unity/total', snap),
            yAxis: 'right'
        },
        {
            label: 'Unity Stockpile',
            selector: snap => selectNested('economy/stockpile/unity', snap),
            yAxis: 'right'
        },
        {
            label: 'Adopted Trees',
            selector: snap => selectNested('unity/adopted_trees', snap)
        },
        {
            label: 'Adopted Traditions',
            selector: snap => selectNested('unity/traditions', snap)
        },
        {
            label: 'Completed Trees',
            selector: snap => selectNested('unity/finished_trees', snap)
        },
        {
            label: 'Ascension Perks',
            selector: snap => selectNested('unity/acension_perks', snap)
        }
    ]

    return (
        <Chart overlay={props.overlay} title='Unity' titleColor='#0b9cbd'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel='Count'
                rightYLabel='Unity'
            />
        </Chart>
    );
}

registerChart(
    'Unity',
    'Shows Unity income and stockpile alongside adopted traditions over time',
    Unity
);

export default Unity;
