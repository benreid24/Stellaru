import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Empire Wide Construction Overview';

function AllConstruction(props) {
    const name = props.name ? props.name : 'allconstruction';
    const data = props.data;

    const lines = [
        {
            label: translate('Total Construction Queues'),
            selector: snap => selectNested('construction/queue_count', snap)
        },
        {
            label: translate('Total Queued Items'),
            selector: snap => selectNested('construction/queued_items', snap)
        },
        {
            label: translate('Average Queue Size'),
            selector: snap => selectNested('construction/avg_queue_size', snap),
            yAxis: 'right'
        },
        {
            label: translate('Max Queue Size'),
            selector: snap => selectNested('construction/max_queue_size', snap)
        }
    ];

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Empire Wide Construction Overview')} titleColor='#e68e00'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel={translate('Count')}
                rightYLabel={translate('Average')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Gives stats on empire wide construction queues and capability',
    AllConstruction,
    'Construction'
);

export default AllConstruction;
