import React from 'react';

import {Cell, PieChart as RePieChart} from 'recharts';
import {Pie} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {Tooltip} from 'recharts';
import {Legend} from 'recharts';

import {getDataColors, valueTickFormat} from './Util';

function PieChart(props) {
    const sections = props.sections;
    const label = props.label;
    const formatter = props.formatter ? props.formatter : valueTickFormat;
    const labelColors = props.labelColors ? props.labelColors : getDataColors(sections.map(section => section.label))[0];

    // TODO - onMouseEnter/Leave change stroke thickness
    // TODO - preserve label colors in state like ComposedChart. Do same in scatter

    return (
        <ResponsiveContainer>
            <RePieChart data={sections}>
                <Pie
                    data={sections}
                    dataKey='value'
                    nameKey='label'
                    formatter={formatter}
                    label={label !== undefined ? label : data => formatter(data.payload.value)}
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
