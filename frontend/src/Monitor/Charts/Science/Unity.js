import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Unity(props) {
    const data = props.data;

    // TODO - build in support for multiple y-axes
    const lines = [
        {
            label: 'Unity Income',
            selector: snap => selectNested('economy/income/unity/total', snap)
        },
        {
            label: 'Unity Stockpile',
            selector: snap => selectNested('economy/stockpile/unity', snap)
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
            selector: snap => selectNested('unity/traditions', snap)
        },
        {
            label: 'Ascension Perks',
            selector: snap => selectNested('unity/ascension_perks', snap)
        }
    ]

    return (
        <Chart overlay={props.overlay} title='Unity' titleColor='#0b9cbd'>
            <LineChart
                data={data}
                allowIsolation={true}
                lines={lines}
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
