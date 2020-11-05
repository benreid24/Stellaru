import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Net Core Resource Incomes';

function NetResourceIncome(props) {
    const name = props.name ? props.name : 'netresourceincome';
    const data = props.data;

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Net Core Resource Incomes')} titleColor='#ded140'>
            <LineChart
                name={name}
                data={data}
                yAxisLabel={translate('Net Income')}
                lines={[
                    {
                        label: translate('Energy Credits'),
                        selector: snap => selectNested('economy/net_income/energy', snap)
                    },
                    {
                        label: translate('Minerals'),
                        selector: snap => selectNested('economy/net_income/minerals', snap)
                    },
                    {
                        label: translate('Food'),
                        selector: snap => selectNested('economy/net_income/food', snap)
                    },
                    {
                        label: translate('Alloys'),
                        selector: snap => selectNested('economy/net_income/alloys', snap)
                    },
                    {
                        label: translate('Consumer Goods'),
                        selector: snap => selectNested('economy/net_income/consumer_goods', snap)
                    }
                ]}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Net incomes of primary resources over time',
    NetResourceIncome
);

export default NetResourceIncome;
