import React, {useState, useEffect} from 'react';

import {Cell, PieChart as RePieChart} from 'recharts';
import {Pie} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {Tooltip} from 'recharts';
import {Legend} from 'recharts';

import {getDataColors, valueTickFormat} from './Util';

function labelColorsEqual(left, right) {
    for (const [label, color] of Object.entries(left)) {
        if (!right.hasOwnProperty(label)) return false;
        if (color !== right[label]) return false;
    }
    return true;
}

function PieChart(props) {
    const sections = props.sections;
    const label = props.label;
    const formatter = props.formatter ? props.formatter : valueTickFormat;

    const [thick, setThick] = useState(null);
    const [initialColors, initialShuffled] = getDataColors(sections.map(section => section.label));
    const [labelColors, setLabelColors] = useState(initialColors);
    const shuffleOrder = useState(initialShuffled)[0];
    useEffect(() => {
        let newLabelColors = getDataColors(sections.map(section => section.label), shuffleOrder)[0];
        if (!labelColorsEqual(newLabelColors, labelColors)) {
            setLabelColors(newLabelColors);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sections]);

    const onMouseEnter = event => {
        setThick(event.payload.name);
    };

    const onMouseLeave = () => {
        setThick(null);
    };

    const renderSection = section => {
        return (
            <Cell
                key={section.label}
                fill={labelColors[section.label]}
                strokeWidth={section.label === thick ? 6 : 1}
                stroke={section.label === thick ? '#ededed' : 'white'}
            />
        );
    };
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
                    {sections.map(renderSection)}
                </Pie>
                <Tooltip formatter={formatter} contentStyle={{backgroundColor: '#303030'}} itemStyle={{color: 'white'}}/>
                <Legend iconType='diamond' onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}/>
            </RePieChart>
        </ResponsiveContainer>
    );
}

export default PieChart;
