import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function AllConstruction(props) {
    const name = props.name ? props.name : 'allconstruction';
    const data = props.data;

    const lines = [
        {
            label: 'Total Construction Queues',
            selector: snap => selectNested('construction/queue_count', snap)
        },
        {
            label: 'Total Queued Items',
            selector: snap => selectNested('construction/queued_items', snap)
        },
        {
            label: 'Average Queue Size',
            selector: snap => selectNested('construction/avg_queue_size', snap),
            yAxis: 'right'
        },
        {
            label: 'Max Queue Size',
            selector: snap => selectNested('construction/max_queue_size', snap)
        }
    ];

    return (
        <Chart overlay={props.overlay} title='Empire Wide Construction Overview' titleColor='#e68e00'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel='Count'
                rightYLabel='Average'
            />
        </Chart>
    );
}

registerChart(
    'Empire Wide Construction Overview',
    'Gives stats on empire wide construction queues and capability',
    AllConstruction
);

export default AllConstruction;
