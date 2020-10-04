import React, {useState} from 'react';

import {LineChart} from 'recharts';
import {Line} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';
import {XAxis} from 'recharts';
import {YAxis} from 'recharts';
import {ReferenceLine} from 'recharts';
import {ResponsiveContainer} from 'recharts';

import {getDataColors, selectNested, valueTickFormat, dateTickFormat} from './Util';

function LineChart2(props) {
    const rawData = props.data;
    const lines = props.lines;
    const labelColors = getDataColors(lines.map(line => line.label));

    let minY = 0;
    const data = rawData.map(snap => {
        const x = selectNested('date_days', snap);
        let datum = {
            x: x,
            xLabel: dateTickFormat(x)
        };
        lines.forEach(line => {
            const value = line.selector(snap);
            if (value < minY)
                minY = value - 5;
            datum[line.label] = value;
        });
        return datum;
    });

    const [isolatedLines, setIsolatedLines] = useState([]);
    const onLineClick = event => {
        const line = event.dataKey;
        if (isolatedLines.includes(line)) {
            setIsolatedLines(isolatedLines.filter(l => l !== line));
        }
        else {
            setIsolatedLines([...isolatedLines, line]);
            if (isolatedLines.length === lines.length - 1)
                setIsolatedLines([]);
        }
    };
    const lineVisible = line => isolatedLines.length === 0 || isolatedLines.includes(line.label);

    const renderLine = line => {
        if (!lineVisible(line))
            return null;
    
        return (
            <Line
                key={line.label}
                name={line.label}
                dataKey={line.label}
                type='monotone'
                dot={false}
                activeDot
                strokeWidth={1}
                connectNulls={false}
                stroke={labelColors[line.label]}
            />
        );
    };
    const renderedLines = lines.map(renderLine);

    const renderLegend = (value, entry) => {
        let weight = 300;
        if (isolatedLines.includes(value))
            weight = 500;
        return <span style={{fontWeight: weight, cursor: 'pointer'}}>{value}</span>;
    };
    const legendPayload = lines.map(line => {
        return {
            value: line.label,
            type: 'line',
            id: line.label,
            dataKey: line.label,
            color: labelColors[line.label]
        };
    });

    return (
        <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                    dataKey='xLabel'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                />
                <YAxis
                    tickFormatter={valueTickFormat}
                    domain={[minY, 'dataMax+5']}
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale='linear'
                />
                <Tooltip formatter={valueTickFormat} contentStyle={{backgroundColor: '#303030'}}/>
                <Legend onClick={onLineClick} formatter={renderLegend} payload={legendPayload}/>
                {minY < 0 && <ReferenceLine y={0} stroke='white' strokeDasharray='3 3'/>}
                {renderedLines}
            </LineChart>
        </ResponsiveContainer>
    );
}

export default LineChart2;
