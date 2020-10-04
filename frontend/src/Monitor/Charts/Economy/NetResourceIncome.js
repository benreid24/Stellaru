import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function NetResourceIncome(props) {
    const data = props.data;

    return (
        <Chart overlay={props.overlay} title='Net Resource Incomes' titleColor='#ded140'>
            <LineChart
                data={data}
                yAxisLabel='Net Income'
                lines={[
                    {
                        label: 'Energy Credits',
                        selector: snap => selectNested('economy/net_income/energy', snap)
                    },
                    {
                        label: 'Minerals',
                        selector: snap => selectNested('economy/net_income/minerals', snap)
                    },
                    {
                        label: 'Food',
                        selector: snap => selectNested('economy/net_income/food', snap)
                    },
                    {
                        label: 'Alloys',
                        selector: snap => selectNested('economy/net_income/alloys', snap)
                    },
                    {
                        label: 'Consumer Goods',
                        selector: snap => selectNested('economy/net_income/consumer_goods', snap)
                    }
                ]}
            />
        </Chart>
    );
}

registerChart(
    'Net Core Resource Incomes',
    'Net incomes of primary resources over time',
    NetResourceIncome
);

export default NetResourceIncome;
