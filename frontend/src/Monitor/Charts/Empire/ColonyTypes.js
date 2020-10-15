import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';

function ColonyTypes(props) {
    const name = props.name ? props.name : 'colonies';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'planets/types');
    const lines = keys.map(key => {
        return {
            label: key,
            selector: snap => selectNested(`planets/types/${key}`, snap)
        };
    });

    return (
        <Chart overlay={props.overlay} title='Colony Types' titleColor='#96d636'>
            <AreaChart
                name={name}
                data={data}
                areas={lines}
                stack={true}
                allowIsolation={true}
            />
        </Chart>
    );
}

registerChart(
    'Colony Types',
    'Shows number of colonies and type breakdown over time',
    ColonyTypes
);

export default ColonyTypes;
