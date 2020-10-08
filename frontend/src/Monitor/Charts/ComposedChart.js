import React, {useState, useEffect} from 'react';

import {ComposedChart as ReChart} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';
import {ReferenceLine} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {YAxis, XAxis} from 'recharts';

import {getCurrentTab} from '../Tabs/CurrentTab';
import {getDataColors, valueTickFormat, selectNested, dateTickFormat, makeId} from './Util';

function ComposedChart(props) {
    const name = props.name ? props.name : null;
    const rawData = props.data;
    const series = props.series;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const rightYLabel = props.rightYLabel ? props.rightYLabel : null;
    const labelColors = props.labelColors ? props.labelColors : getDataColors(series.map(series => series.label));
    const allowIsolation = props.allowIsolation ? true : false;
    const seriesClickCb = props.onSeriesClick;
    const seriesRenderer = props.seriesRenderer;

    const [isolatedSeries, setIsolatedSeries] = useState([]);
    useEffect(() => {
        if (name) {
            const saved = window.localStorage.getItem(`${name}-isolated`);
            if (saved !== null) {
                setIsolatedSeries(JSON.parse(saved));
            }
        }
    }, []);
    useEffect(() => {
        if (name) {
            window.localStorage.setItem(`${name}-isolated`, JSON.stringify(isolatedSeries));
        }
    }, [isolatedSeries]);
    const seriesClick = event => {
        const iseries = event.dataKey;
        if (seriesClickCb)
            seriesClickCb(iseries);
        if (!allowIsolation)
            return;
        if (isolatedSeries.includes(iseries)) {
            setIsolatedSeries(isolatedSeries.filter(l => l !== iseries));
        }
        else {
            let newIsolated = [...isolatedSeries, iseries];
            if (newIsolated.length === series.length)
                newIsolated = [];
            setIsolatedSeries(newIsolated);
        }
    };
    const seriesVisible = series => isolatedSeries.length === 0 || isolatedSeries.includes(series.label);
    
    const data = rawData.map(snap => {
        const x = selectNested('date_days', snap);
        let datum = {
            x: x,
            xLabel: dateTickFormat(x)
        };
        series.forEach(line => {
            const y = line.selector(snap);
            datum[line.label] = y;
        });
        return datum;
    });

    const renderSeries = series => {
        if (!seriesVisible(series))
            return null;
        return seriesRenderer(series);
    };
    const renderedAreas = series.map(renderSeries);

    let minY = 0;
    let showRightAxis = false;
    series.forEach(line => {
        if (line.yAxis === 'right')
            showRightAxis = true;
        if (isolatedSeries.length === 0 || isolatedSeries.includes(line.label)) {
            rawData.forEach(snap => {
                const y = line.selector(snap);
                if (y < minY)
                    minY = y;
            });
        }
    });

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
            <ReChart data={data} syncId={getCurrentTab()} margin={{top: 45, right: 15, left: 15, bottom: 5}}>
                <XAxis
                    dataKey='xLabel'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                />
                <YAxis
                    yAxisId='left'
                    tickFormatter={valueTickFormat}
                    domain={[dataMin => dataMin < 0 ? dataMin : 0, 'dataMax+1']}
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale='linear'
                    label={{value: yLabel, angle: -90, position: 'insideLeft', fill: '#dadada'}}
                />
                <YAxis
                    yAxisId='right'
                    orientation='right'
                    hide={!showRightAxis}
                    tickFormatter={valueTickFormat}
                    domain={[dataMin => dataMin < 0 ? dataMin : 0, 'dataMax+1']}
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale='linear'
                    label={{value: rightYLabel, angle: -90, position: 'insideRight', fill: '#dadada'}}
                />
                <Tooltip formatter={valueTickFormat} contentStyle={{backgroundColor: '#303030'}} wrapperStyle={{zIndex: 9000}}/>
                <Legend onClick={seriesClick} formatter={renderLegend} payload={legendPayload}/>
                {minY < 0 && <ReferenceLine yAxisId='left' y={0} stroke='white' strokeDasharray='3 3'/>}
                <defs>
                    {renderedGradients}
                </defs>
                {renderedAreas}
            </ReChart>
        </ResponsiveContainer>
    );
}

export default ComposedChart;
