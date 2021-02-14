import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {findKeysOverSeries, selectNested} from 'Monitor/Charts/Util';
import {getResourceName, filterResources} from './Util';
import {translate} from 'Translator';

const Name = 'All Resource Net Incomes';

function AllResourceIncomes(props) {
    const name = props.name ? props.name : 'allresourceincome';
    const data = props.data;

    const keys = filterResources(findKeysOverSeries(data, 'economy/net_income'));
    const lines = keys.map(key => {
        return {
            label: translate(getResourceName(key)),
            selector: snap => selectNested(`economy/net_income/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('All Resource Net Incomes')} titleColor='#ded140'>
            <LineChart
                name={name}
                data={data}
                yAxisLabel={translate('Net Income')}
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Net incomes of all resources over time',
    AllResourceIncomes,
    'Economy'
);

export default AllResourceIncomes;
