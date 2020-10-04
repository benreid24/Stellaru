import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart2';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function NetResourceIncome(props) {
    const data = props.data;
    const height = props.height;

    return (
        <Chart overlay={props.overlay}>
            <LineChart
                data={data}
                height={height}
                title='Net Resource Incomes'
                titleColor='#ded140'
                yAxisLabel='Net Income'
                showLabels={false}
                padding={{left: 50, top: 30, right: 30, bottom: 50}}
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
