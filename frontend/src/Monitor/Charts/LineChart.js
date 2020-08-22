import React, {useState} from 'react';

import {VictoryLine, VictoryAxis} from 'victory';
import {Chart} from './Charts';

import {Legend} from './Legend';
import {getDataColors, selectNested, valueTickFormat, dateTickFormat} from './Util';

import './Charts.css';

function LineChart(props) {
    const data = props.data;
    const height = props.height;
    const title = props.title;
    const titleColor = props.titleColor;
    const yAxisLabel = props.yAxisLabel;
    const lines = props.lines;
    const renderLabel = props.showLabels;
    const labelColors = getDataColors(lines.map(line => line.label));

    const [isolatedLines, setIsolatedLines] = useState([]);
    const onLineclick = line => {
        if (isolatedLines.includes(line)) {
            setIsolatedLines(isolatedLines.filter(l => l !== line));
        }
        else {
            setIsolatedLines([...isolatedLines, line]);
        }
    };

    let domain = [null, null];
    let chartMin = -10;

    const lineVisible = line => isolatedLines.length === 0 || isolatedLines.includes(line.label);
    const renderLine = line => {
        const lineData = props.data.map(snap => {
            const x = selectNested('date_days', snap);
            const y= line.selector(snap);
            if (domain[0] === null || domain[0] > x) {
                domain[0] = x;
            }
            if (domain[1] === null || domain[1] < x) {
                domain[1] = x;
            }
            if (chartMin > y) {
                chartMin = y;
            }
            return {
                x: x,
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
    const renderedLines = lines.filter(lineVisible).map(renderLine);

    // TODO - set x domain based on global zoom level
    return (
        <Chart height={height} title={title} titleColor={titleColor} domain={domain} yMin={chartMin}>
            <VictoryAxis
                axisValue={0}
                style={{
                    tickLabels: {fill: "none"},
                    axis: {stroke: 'white', strokeWidth: 2, strokeDasharray: 4}
                }}
            />
            {renderedLines}
            <VictoryAxis
                tickFormat={dateTickFormat}
                style={{
                    axisLabel: {fill: '#9a9a9a'},
                    ticks: {stroke: "grey", size: 5}
                }}
                offsetY={50}
            />
            <VictoryAxis dependentAxis
                crossAxis={false}
                label={yAxisLabel}
                tickFormat={valueTickFormat}
                style={{axisLabel: {fill: titleColor}, ticks: {stroke: "grey", size: 5}}}
            />
            <Legend labels={labelColors} chartHeight={height} onClick={onLineclick} isolated={isolatedLines}/>
        </Chart>
    );
}

export default LineChart;
