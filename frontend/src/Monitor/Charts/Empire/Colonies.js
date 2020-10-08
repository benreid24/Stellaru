import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';

function Colonies(props) {
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
        <Chart overlay={props.overlay} title='Colonies' titleColor='#96d636'>
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
    'Colonies',
    'Shows number of colonies and type breakdown over time',
    Colonies
);

export default Colonies;
