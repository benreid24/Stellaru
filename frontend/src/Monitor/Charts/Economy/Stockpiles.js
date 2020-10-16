import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';
import {getResourceName, filterResources} from './Util';

const Name = 'All Resource Stockpiles';

function Stockpiles(props) {
    const name = props.name ? props.name : 'stockpiles';
    const data = props.data;

    const keys = filterResources(findKeysOverSeries(data, 'economy/stockpile'));
    const lines = keys.map(key => {
        return {
            label: getResourceName(key),
            selector: snap => selectNested(`economy/stockpile/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title='Resource Stockpiles' titleColor='#ded140'>
            <LineChart
                name={name}
                data={data}
                yAxisLabel='Stockpile'
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Stockpiles of all resources over time',
    Stockpiles
);

export default Stockpiles;
