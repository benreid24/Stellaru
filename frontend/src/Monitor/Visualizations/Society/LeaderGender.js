import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import AreaChart from 'Monitor/Charts/AreaChart';
import PieChart from 'Monitor/Charts/PieChart';
import {selectNested, percentValueFormat} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

import './Society.css';

const Name = 'Leader Gender Breakdown';

function LeaderGender(props) {
    const name = props.name ? props.name : 'leadergender';
    const data = props.data;

    const areas = [
        {
            label: translate('Percent Male'),
            selector: snap => selectNested('leaders/percent_male', snap) * 100
        },
        {
            label: translate('Percent Female'),
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
        <Chart name={Name} overlay={props.overlay} title={translate('Leader Gender Breakdown')} titleColor='#65c73c'>
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
