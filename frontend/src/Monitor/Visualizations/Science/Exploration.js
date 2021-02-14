import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Exploration';

function Exploration(props) {
    const name = props.name ? props.name : 'exploration';
    const data = props.data;

    const lines = [
        {
            label: translate('Surveyed Systems'),
            selector: snap => selectNested('systems/surveyed_systems', snap)
        },
        {
            label: translate('Surveyed Objects'),
            selector: snap => selectNested('systems/surveyed_objects', snap)
        },
        {
            label: translate('Owned Systems'),
            selector: snap => selectNested('systems/owned', snap)
        }
    ]

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Exploration')} titleColor='#0b9cbd'>
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
    Exploration,
    'Science'
);

export default Exploration;
