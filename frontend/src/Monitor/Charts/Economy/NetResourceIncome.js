import React from 'react';

import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function NetResourceIncome(props) {
    const data = props.data;
    const height = props.height;

    return (
        <div className='chart'>
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
        </div>
    );
}

registerChart(
    'Net Core Resource Incomes',
    'Net incomes of primary resources over time',
    NetResourceIncome
);

export default NetResourceIncome;
