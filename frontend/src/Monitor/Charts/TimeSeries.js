import React from 'react';

import {VictoryAxis} from 'victory';
import {ChartBase} from './ChartBase';

import Legend from './Legend';
import {selectNested, valueTickFormat, dateTickFormat} from './Util';

import './Charts.css';

const EmptyDayStart = 2200 * 360;
const EmptyDayEnd = 2200 * 360 + 1;

function TimeSeries(props) {
    const data = props.data;
    const height = props.height;
    const title = props.title;
    const titleColor = props.titleColor;
    const yAxisLabel = props.yAxisLabel;
    const lines = props.series;
    const renderSeries = props.seriesRenderer;
    const labelColors = props.labelColors;
    const onLegendClick = props.onLegendClick;

    const days = data.map(snap => selectNested('date_days', snap));
    const domain = [
        days.length > 0 ? Math.min(...days) : EmptyDayStart,
        days.length > 0 ? Math.max(...days) : EmptyDayEnd
    ];
    let chartMin = 0;
    const checkMin = value => {
        if (value < chartMin)
            chartMin = value - 1;
    };
    const renderedSeries = lines.map(series => renderSeries(series, checkMin));

    // TODO - set x domain based on global zoom level
    return (
        <ChartBase height={height} title={title} titleColor={titleColor} domain={domain} yMin={chartMin} padding={props.padding}>
            {chartMin !== 0 && 
                <VictoryAxis
                    axisValue={0}
                    style={{
                        tickLabels: {fill: "none"},
                        axis: {stroke: 'white', strokeWidth: 2, strokeDasharray: 4}
                    }}
                />
            }
            {renderedSeries}
            <VictoryAxis
                tickFormat={dateTickFormat}
                style={{
                    axisLabel: {fill: '#9a9a9a'},
                    ticks: {stroke: "grey", size: 5}
                }}
                offsetY={props.padding ? (props.padding.bottom ? props.padding.bottom : props.padding) : 50}
            />
            <VictoryAxis dependentAxis
                crossAxis={false}
                label={yAxisLabel ? yAxisLabel : null}
                tickFormat={valueTickFormat}
                fixLabelOverlap={true}
                style={{axisLabel: {fill: titleColor}, ticks: {stroke: "grey", size: 5}}}
            />
            <Legend labels={labelColors} chartHeight={height} onClick={onLegendClick} emphasized={props.emphasized}/>
        </ChartBase>
    );
}

export default TimeSeries;
