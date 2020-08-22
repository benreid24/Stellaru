import React from 'react';

import LineChart from '../LineChart';
import {selectNested} from '../Util';

function NetResourceIncome(props) {
    const data = props.data;
    const height = props.height;

    return (
        <LineChart
            data={data}
            height={height}
            title='Net Resource Incomes'
            titleColor='#d9c218'
            yAxisLabel='Net Income'
            showLabels={false}
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
    );
}

export default NetResourceIncome;
