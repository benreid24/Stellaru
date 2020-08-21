import React from 'react';

import {VictoryLine, VictoryAxis} from 'victory';
import {Chart} from './Charts';

import {Legend} from './Legend';
import {getDataColors, selectNested, valueTickFormat, dateTickFormat} from './Util';

import './Charts.css';

function LineChart(props) {
    const height = 200;
    const title = 'Net Resource Incomes';
    const titleColor = '#e8db27';
    const yAxisLabel = 'Net Income';
    const netMinerals = snap => selectNested('economy/net_income/minerals', snap);
    const netEnergy = snap => selectNested('economy/net_income/energy', snap);
    const lines = [
        {
            label: 'Energy Credits',
            selector: netEnergy
        },
        {
            label: 'Minerals',
            selector: netMinerals
        }
    ];
    // TODO - get above from props

    const labelColors = getDataColors(lines.map(line => line.label));
    const renderedLines = lines.map(line => {
        const data = props.data.map(snap => {
            return {
                x: selectNested('date_days', snap),
                y: line.selector(snap)
            };
        });
        if (data.length > 0) {
            let value = Math.round(data[data.length-1].y);
            data[data.length-1].label = valueTickFormat(value);
        }
        return (
            <VictoryLine
                key={line.label}
                style={{
                    data: {stroke: labelColors[line.label]},
                    labels: {fill: '#d2d2d2'}
                }}
                data={data}
            />
        );
    });

    return (
        <Chart height={height} title={title} titleColor={titleColor}>
            {renderedLines}
            <VictoryAxis crossAxis
                tickFormat={dateTickFormat}
                style={{
                    axisLabel: {fill: '#9a9a9a'}
                }}
            />
            <VictoryAxis dependentAxis
                label={yAxisLabel}
                tickFormat={valueTickFormat}
                style={{axisLabel: {fill: '#e8db27'}}}
            />
            <Legend labels={labelColors} chartHeight={height}/>
        </Chart>
    );
}

export default LineChart;
