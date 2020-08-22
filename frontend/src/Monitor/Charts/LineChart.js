import React from 'react';

import {VictoryLine, VictoryAxis} from 'victory';
import {Chart} from './Charts';

import {Legend} from './Legend';
import {getDataColors, selectNested, valueTickFormat, dateTickFormat} from './Util';

import './Charts.css';

function LineChart(props) {
    const height = props.height;
    const title = props.title;
    const titleColor = props.titleColor;
    const yAxisLabel = props.yAxisLabel;
    const lines = props.lines;
    const renderLabel = props.showLabels;

    let domain = [null, null];
    const labelColors = getDataColors(lines.map(line => line.label));
    const renderedLines = lines.map(line => {
        const data = props.data.map(snap => {
            const x = selectNested('date_days', snap);
            if (domain[0] === null || x < domain[0]) {
                domain[0] = x;
            }
            if (domain[1] === null || x > domain[1]) {
                domain[1] = x;
            }
            return {
                x: x,
                y: line.selector(snap)
            };
        });
        if (data.length > 0 && renderLabel) {
            let value = Math.round(data[data.length-1].y);
            data[data.length-1].label = valueTickFormat(value);
        }
        return (
            <VictoryLine
                key={line.label}
                name={line.label}
                style={{
                    data: {stroke: labelColors[line.label]},
                    labels: {fill: '#d2d2d2'}
                }}
                data={data}
            />
        );
    });

    // TODO - set x domain based on global zoom level
    return (
        <Chart height={height} title={title} titleColor={titleColor} domain={domain}>
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
                label={yAxisLabel}
                tickFormat={valueTickFormat}
                style={{axisLabel: {fill: titleColor}, ticks: {stroke: "grey", size: 5}}}
            />
            <Legend labels={labelColors} chartHeight={height}/>
        </Chart>
    );
}

export default LineChart;
