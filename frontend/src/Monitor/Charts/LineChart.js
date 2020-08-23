import React, {useState} from 'react';

import {VictoryLine} from 'victory';

import TimeSeries from './TimeSeries';
import {getDataColors, selectNested, valueTickFormat} from './Util';

import './Charts.css';

function LineChart(props) {
    const data = props.data;
    const lines = props.lines;
    const renderLabel = props.showLabels;
    const labelColors = getDataColors(lines.map(line => line.label));

    const [isolatedLines, setIsolatedLines] = useState([]);
    const onLineClick = line => {
        if (isolatedLines.includes(line)) {
            setIsolatedLines(isolatedLines.filter(l => l !== line));
        }
        else {
            setIsolatedLines([...isolatedLines, line]);
        }
    };
    const lineVisible = line => isolatedLines.length === 0 || isolatedLines.includes(line.label);

    const renderLine = (line, registerValue) => {
        if (!lineVisible(line))
            return null;

        const lineData = data.map(snap => {
            const y = line.selector(snap);
            registerValue(y);
            return {
                x: selectNested('date_days', snap),
                y: y
            };
        });
    
        if (lineData.length > 0 && renderLabel) {
            let value = Math.round(lineData[lineData.length-1].y);
            lineData[lineData.length-1].label = valueTickFormat(value);
        }
        return (
            <VictoryLine
                key={line.label}
                name={line.label}
                style={{
                    data: {stroke: labelColors[line.label]},
                    labels: {fill: '#d2d2d2'}
                }}
                data={lineData}
            />
        );
    };

    return (
        <TimeSeries
            data={data}
            height={props.height}
            title={props.title}
            titleColor={props.titleColor}
            yAxisLabel={props.yAxisLabel}
            labelColors={labelColors}
            series={lines}
            seriesRenderer={renderLine}
            onLegendClick={onLineClick}
            emphasized={isolatedLines}
            padding={props.padding}
        />
    );
}

export default LineChart;
