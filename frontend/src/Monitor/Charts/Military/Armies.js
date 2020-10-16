import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';

const Name = 'Army Breakdown';

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
        <Chart name={Name} overlay={props.overlay} title='Armies' titleColor='#de1212'>
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
    'Displays number of armies by type over time',
    Armies
);

export default Armies;
