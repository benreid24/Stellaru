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

function ScienceOutput(props) {
    const data = props.data;
    const height = props.height;

    return (
        <LineChart
            data={data}
            height={height}
            title='Science Output'
            titleColor='#0b9cbd'
            yAxisLabel='Monthly Research'
            showLabels={false}
            lines={[
                {
                    label: 'Physics Research',
                    selector: snap => selectNested('economy/net_income/physics_research', snap)
                },
                {
                    label: 'Society Research',
                    selector: snap => selectNested('economy/net_income/society_research', snap)
                },
                {
                    label: 'Engineering Research',
                    selector: snap => selectNested('economy/net_income/engineering_research', snap)
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
            <div className='col-4'>
                <ScienceOutput data={data} height={200}/>
            </div>
        </div>
    );
}

export default Overview;
