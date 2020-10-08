import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries, capitalize} from '../Util';
import {registerChart} from '../../ChartRegistry';

function ConstructionQueues(props) {
    const data = props.data;

    const keys = findKeysOverSeries(data, 'construction/breakdown');
    const areas = keys.map(key => {
        return {
            label: capitalize(key),
            selector: snap => selectNested(`construction/breakdown/${key}/queue_count`, snap)
        }
    });

    return (
        <Chart overlay={props.overlay} title='Construction Queue Counts' titleColor='#e68e00'>
            <AreaChart
                name='constructionqueues'
                data={data}
                stack={true}
                allowIsolation={true}
                areas={areas}
            />
        </Chart>
    );
}

registerChart(
    'Construction Queue Counts',
    'Shows the number of construction queues by type over time',
    ConstructionQueues
);

export default ConstructionQueues;
