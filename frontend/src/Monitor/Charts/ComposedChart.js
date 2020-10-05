import React, {useState} from 'react';

import {ComposedChart as ReChart} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';
import {ReferenceLine} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {YAxis, XAxis} from 'recharts';

import {getDataColors, valueTickFormat, selectNested, dateTickFormat, makeId} from './Util';

function ComposedChart(props) {
    const rawData = props.data;
    const series = props.series;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const labelColors = props.labelColors ? props.labelColors : getDataColors(series.map(series => series.label));
    const allowIsolation = props.allowIsolation ? true : false;
    const seriesClickCb = props.onSeriesClick;
    const seriesRenderer = props.seriesRenderer;
    
    let minY = 0;
    const data = rawData.map(snap => {
        const x = selectNested('date_days', snap);
        let datum = {
            x: x,
            xLabel: dateTickFormat(x)
        };
        series.forEach(line => {
            const value = line.selector(snap);
            if (value < minY)
                minY = value - 5;
            datum[line.label] = value;
        });
        return datum;
    });

    const [isolatedSeries, setIsolatedSeries] = useState([]);
    const onAreaClick = event => {
        const series = event.dataKey;
        if (seriesClickCb)
            seriesClickCb(series);
        if (!allowIsolation)
            return;
        if (isolatedSeries.includes(series)) {
            setIsolatedSeries(isolatedSeries.filter(l => l !== series));
        }
        else {
            setIsolatedSeries([...isolatedSeries, series]);
            if (isolatedSeries.length === series.length - 1)
                setIsolatedSeries([]);
        }
    };
    const areaVisible = series => isolatedSeries.length === 0 || isolatedSeries.includes(series.label);

    const renderSeries = series => {
        if (!areaVisible(series))
            return null;
        return seriesRenderer(series);
    };
    const renderedAreas = series.map(renderSeries);

    const renderGradient = series => {
        return (
            <linearGradient id={makeId(series.label)} x1='0' y1='0' x2='0' y2='1' key={series.label}>
                <stop offset='5%' stopColor={labelColors[series.label]} stopOpacity={0.8}/>
                <stop offset='95%' stopColor={labelColors[series.label]} stopOpacity={0.1}/>
            </linearGradient>
        );
    };
    const renderedGradients = series.map(renderGradient);

    const renderLegend = value => {
        let weight = 300;
        if (isolatedSeries.includes(value))
            weight = 500;
        return <span style={{fontWeight: weight, cursor: 'pointer'}}>{value}</span>;
    };
    const legendPayload = series.map(series => {
        return {
            value: series.label,
            type: 'line',
            id: series.label,
            dataKey: series.label,
            color: labelColors[series.label]
        };
    });

    return (
        <ResponsiveContainer>
            <ReChart data={data} syncId='stellaru' margin={{top: 45, right: 15, left: 15, bottom: 5}}>
                <XAxis
                    dataKey='xLabel'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                />
                <YAxis
                    tickFormatter={valueTickFormat}
                    domain={[minY, 'dataMax+1']}
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale='linear'
                    label={{value: yLabel, angle: -90, position: 'insideBottomLeft', fill: '#dadada', offset: 10}}
                />
                <Tooltip formatter={valueTickFormat} contentStyle={{backgroundColor: '#303030'}}/>
                <Legend onClick={onAreaClick} formatter={renderLegend} payload={legendPayload}/>
                {minY < 0 && <ReferenceLine y={0} stroke='white' strokeDasharray='3 3'/>}
                <defs>
                    {renderedGradients}
                </defs>
                {renderedAreas}
            </ReChart>
        </ResponsiveContainer>
    );
}

export default ComposedChart;
