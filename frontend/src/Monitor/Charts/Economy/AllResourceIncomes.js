import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';
import {getResourceName, filterResources} from './Util';

const Name = 'All Resource Net Incomes';

function AllResourceIncomes(props) {
    const name = props.name ? props.name : 'allresourceincome';
    const data = props.data;

    const keys = filterResources(findKeysOverSeries(data, 'economy/net_income'));
    const lines = keys.map(key => {
        return {
            label: getResourceName(key),
            selector: snap => selectNested(`economy/net_income/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title='All Resource Net Incomes' titleColor='#ded140'>
            <LineChart
                name={name}
                data={data}
                yAxisLabel='Net Income'
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Net incomes of all resources over time',
    AllResourceIncomes
);

export default AllResourceIncomes;
