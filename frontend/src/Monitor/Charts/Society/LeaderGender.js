import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import PieChart from '../PieChart';
import {selectNested, percentValueFormat} from '../Util';
import {registerChart} from '../../ChartRegistry';

import './Society.css';

const Name = 'Leader Gender Breakdown';

function LeaderGender(props) {
    const name = props.name ? props.name : 'leadergender';
    const data = props.data;

    const areas = [
        {
            label: 'Percent Male',
            selector: snap => selectNested('leaders/percent_male', snap) * 100
        },
        {
            label: 'Percent Female',
            selector: snap => (1 - selectNested('leaders/percent_male', snap)) * 100
        }
    ];
    const sections = areas.map(area => {
        return {
            label: area.label,
            value: data.length > 0 ? area.selector(data[data.length-1]) : 0.5
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title='Leader Gender Breakdown' titleColor='#65c73c'>
            <div className='genderAreaChart'>
                <AreaChart
                    name={name}
                    data={data}
                    allowIsolation={true}
                    stack={true}
                    areas={areas}
                />
            </div>
            <div className='genderPieChart'>
                <PieChart sections={sections} formatter={percentValueFormat}/>
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Shows gender breakdown over time',
    LeaderGender
);

export default LeaderGender;
