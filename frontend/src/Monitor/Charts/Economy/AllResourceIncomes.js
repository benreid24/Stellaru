import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';
import {getResourceName, filterResources} from './Util';

function AllResourceIncomes(props) {
    const data = props.data;

    const keys = filterResources(findKeysOverSeries(data, 'economy/net_income'));
    const lines = keys.map(key => {
        return {
            label: getResourceName(key),
            selector: snap => selectNested(`economy/net_income/${key}`, snap)
        };
    });

    return (
        <Chart overlay={props.overlay} title='All Resource Net Incomes' titleColor='#ded140'>
            <LineChart
                name='allresourceincomes'
                data={data}
                yAxisLabel='Net Income'
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    'All Resource Net Incomes',
    'Net incomes of all resources over time',
    AllResourceIncomes
);

export default AllResourceIncomes;
