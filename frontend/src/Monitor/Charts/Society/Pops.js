import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Pops(props) {
    const data = props.data;

    const keys = findKeysOverSeries(data, 'pops/species');
    const areas = keys.map(key => {
        return {
            label: key,
            selector: snap => selectNested(`pops/species/${key}`, snap)
        };
    });

    return (
        <Chart overlay={props.overlay} title='Pops' titleColor='#65c73c'>
            <AreaChart
                name='pops'
                data={data}
                allowIsolation={true}
                stack={true}
                areas={areas}
            />
        </Chart>
    );
}

registerChart(
    'Pops',
    'Shows population and species breakdown over time',
    Pops
);

export default Pops;
