import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Exploration(props) {
    const data = props.data;

    const lines = [
        {
            label: 'Surveyed Systems',
            selector: snap => selectNested('systems/surveyed_systems', snap)
        },
        {
            label: 'Surveyed Objects',
            selector: snap => selectNested('systems/surveyed_objects', snap)
        },
        {
            label: 'Owned Systems',
            selector: snap => selectNested('systems/owned', snap)
        }
    ]

    return (
        <Chart overlay={props.overlay} title='Exploration' titleColor='#0b9cbd'>
            <LineChart
                data={data}
                allowIsolation={true}
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    'Exploration',
    'Shows number of surveyed ojects and systems over time',
    Exploration
);

export default Exploration;
