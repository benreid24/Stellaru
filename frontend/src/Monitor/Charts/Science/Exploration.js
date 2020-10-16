import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

const Name = 'Exploration';

function Exploration(props) {
    const name = props.name ? props.name : 'exploration';
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
        <Chart name={Name} overlay={props.overlay} title='Exploration' titleColor='#0b9cbd'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows number of surveyed ojects and systems over time',
    Exploration
);

export default Exploration;
