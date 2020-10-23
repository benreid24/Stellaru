import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested, capitalize} from '../Util';

const Name = 'Ship Types';

function Ships(props) {
    const name = props.name ? props.name : 'ships';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'fleets/ship_types');
    const lines = keys.map(key => {
        return {
            label: capitalize(key, '_'),
            selector: snap => selectNested(`fleets/ship_types/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title='Ship Types' titleColor='#de1212'>
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
    Name,
    'Displays number of ships by type over time',
    Ships
);

export default Ships;
