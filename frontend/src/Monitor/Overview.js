import React from 'react';

import LineChart from './Charts/LineChart';
import {selectNested} from './Charts/Util';

function NetResourceIncome(props) {
    const data = props.data;
    const height = props.height;

    return (
        <LineChart
            data={data}
            height={height}
            title='Net Resource Incomes'
            titleColor='#e8db27'
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

function Overview(props) {
    const data = props.data;

    return (
        <div className='row'>
            <div className='col-4'>
                <NetResourceIncome data={data} height={200}/>
            </div>
        </div>
    );
}

export default Overview;
