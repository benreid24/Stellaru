import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';

function Armies(props) {
    const name = props.name ? props.name : 'armies';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'armies/types');
    const lines = keys.map(key => {
        return {
            label: key,
            selector: snap => selectNested(`armies/types/${key}`, snap)
        };
    });

    return (
        <Chart overlay={props.overlay} title='Armies' titleColor='#de1212'>
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
    'Army Breakdown',
    'Displays number of armies by type over time',
    Armies
);

export default Armies;
