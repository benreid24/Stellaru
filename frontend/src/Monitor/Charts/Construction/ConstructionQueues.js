import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries, capitalize} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from '../../../Translator';

const Name = 'Construction Queue Counts';

function ConstructionQueues(props) {
    const name = props.name ? props.name : 'constructionqueuecounts';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'construction/breakdown');
    const areas = keys.map(key => {
        return {
            label: translate(capitalize(key)),
            selector: snap => selectNested(`construction/breakdown/${key}/queue_count`, snap)
        }
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Construction Queue Counts')} titleColor='#e68e00'>
            <AreaChart
                name={name}
                data={data}
                stack={true}
                allowIsolation={true}
                areas={areas}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows the number of construction queues by type over time',
    ConstructionQueues
);

export default ConstructionQueues;
