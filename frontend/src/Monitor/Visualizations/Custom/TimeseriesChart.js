import React from 'react';

import ComposedChart from 'Monitor/Charts/ComposedChart';
import {selectNested, valueTickFormat, dateTickFormat, findKeysOverSeries, renderLine, renderArea} from 'Monitor/Charts/Util';
import {makeLabelFromKey} from './CustomChartRepository';

function TimeseriesChart(props) {
    const data = props.data;
    const chart = props.chart;
    const ts = chart.timeseries;

    const xFormat = ts.x.includes('date_days') ? dateTickFormat : valueTickFormat;
    const xSelect = snap => selectNested(ts.x.join('/'), snap);

    const generateSeries = series => {
        const i = series.data.indexOf(null);
        if (i < 0) {
            return [{
                selector: snap => selectNested(series.data.join('/'), snap),
                label: series.label,
                type: series.type,
                stack: series.stackId,
                yAxis: series.axis
            }];
        }
        else {
            const keys = findKeysOverSeries(data, series.data.slice(0, i).join('/'));
            return keys.map(key => {
                return {
                    selector: snap => selectNested([...series.data.slice(0, i), key, ...series.data.slice(i + 1)].join('/'), snap),
                    label: makeLabelFromKey(key),
                    type: series.type,
                    stack: series.stackId,
                    yAxis: series.axis
                };
            });
        }
    };
    const series = ts.y.map(generateSeries).flat();
    console.log(series);

    const renderSeries = (series, labelColors, onClick) => {
        if (series.type === 'line') {
            return renderLine(series, labelColors[series.label], onClick);
        }
        else {
            return renderArea(series, labelColors[series.label], series.stack === 'none' ? null : series.stack, onClick);
        }
    }

    return (
        <ComposedChart
            name={chart.name}
            data={data}
            series={series}
            yAxisLabel={ts.leftAxisLabel}
            rightYLabel={ts.rightAxisLabel}
            allowIsolation
            seriesRenderer={renderSeries}
            leftScale={ts.leftScale}
            rightScale={ts.rightScale}
            xSelect={xSelect}
            xFormat={xFormat}
            xLabel={ts.xAxisLabel}
        />
    );
}

export default TimeseriesChart;
