import React from 'react';

import {Cell, PieChart as RePieChart} from 'recharts';
import {Pie} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {Tooltip} from 'recharts';
import {Legend} from 'recharts';

import {getDataColors, valueTickFormat} from './Util';

function PieChart(props) {
    const sections = props.sections;
    const label = props.label ? props.label : true;
    const formatter = props.formatter ? props.formatter : valueTickFormat;
    const labelColors = props.labelColors ? props.labelColors : getDataColors(sections.map(section => section.label))[0];

    return (
        <ResponsiveContainer>
            <RePieChart data={sections}>
                <Pie
                    data={sections}
                    dataKey='value'
                    nameKey='label'
                    formatter={formatter}
                    label={label ? data => formatter(data.payload.value) : false}
                    labelLine={true}
                    startAngle={90}
                    endAngle={450}
                >
                    {sections.map(section => <Cell key={section.label} fill={labelColors[section.label]}/>)}
                </Pie>
                <Tooltip formatter={formatter} contentStyle={{backgroundColor: '#303030'}} itemStyle={{color: 'white'}}/>
                <Legend iconType='diamond'/>
            </RePieChart>
        </ResponsiveContainer>
    );
}

export default PieChart;
