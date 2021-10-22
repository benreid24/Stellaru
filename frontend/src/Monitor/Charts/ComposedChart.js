import React, {useState, useEffect} from 'react';

import {ComposedChart as ReChart} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';
import {ReferenceLine} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {YAxis, XAxis} from 'recharts';

import {getCurrentTab} from 'Monitor/Tabs/CurrentTab';
import {getDataColors, valueTickFormat, selectNested, dateTickFormat, makeId} from './Util';
import {AxisLabel, RenderTooltip, ScrollableLegend} from './CustomComponents';

function labelColorsEqual(left, right) {
    for (const [label, color] of Object.entries(left)) {
        if (!right.hasOwnProperty(label)) return false;
        if (color !== right[label]) return false;
    }
    return true;
}

function ComposedChart(props) {
    const name = props.name ? props.name : null;
    const rawData = props.data;
    const series = props.series;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const rightYLabel = props.rightYLabel ? props.rightYLabel : null;
    const formatter = props.formatter ? props.formatter : valueTickFormat;
    const allowIsolation = props.allowIsolation ? true : false;
    const seriesClickCb = props.onSeriesClick;
    const seriesRenderer = props.seriesRenderer;
    const leftDomain = props.leftDomain ? props.leftDomain : [dataMin => dataMin < 0 ? dataMin : 0, 'dataMax+1'];
    const rightDomain = props.rightDomain ? props.rightDomain : [dataMin => dataMin < 0 ? dataMin : 0, 'dataMax+1'];
    const leftScale = props.leftScale ? props.leftScale : 'linear';
    const rightScale = props.rightScale ? props.rightScale : 'linear';
    const xSelect = props.xSelect ? props.xSelect : snap => selectNested('date_days', snap);
    const xFormat = props.xFormat ? props.xFormat : dateTickFormat;
    const xLabel = props.xLabel ? props.xLabel : '';

    series.forEach(series => {
        series.labelId = makeId(`${name}_${series.label}`);
    });

    const [initialColors, initialShuffled] = getDataColors(series.map(series => series.label));
    const [labelColors, setLabelColors] = useState(props.labelColors ? props.labelColors : initialColors);
    const shuffleOrder = useState(initialShuffled)[0];
    useEffect(() => {
        let newLabelColors = null;
        if (!props.labelColors) {
            newLabelColors = getDataColors(series.map(series => series.label), shuffleOrder)[0];
        }
        else {
            newLabelColors = props.labelColors;
        }

        if (!labelColorsEqual(newLabelColors, labelColors)) {
            setLabelColors(newLabelColors);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [series, props.labelColors]);

    const [isolatedSeries, setIsolatedSeries] = useState([]);
    useEffect(() => {
        if (name) {
            const saved = window.localStorage.getItem(`${name}-isolated`);
            if (saved !== null) {
                setIsolatedSeries(JSON.parse(saved));
            }
        }
    }, [name]);
    useEffect(() => {
        if (name) {
            window.localStorage.setItem(`${name}-isolated`, JSON.stringify(isolatedSeries));
        }
    }, [isolatedSeries, name]);
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
        const x = xSelect(snap);
        let datum = {
            x: x,
            xLabel: xFormat(x)
        };
        series.forEach(line => {
            const y = line.selector(snap);
            datum[line.label] = y;
        });
        return datum;
    });

    let renderedSeriesOnce = false;
    const renderSeries = series => {
        if (!seriesVisible(series))
            return null;
        renderedSeriesOnce = true;
        const renderer = series.renderer ? series.renderer : seriesRenderer;
        return renderer(series, labelColors, () => {
            seriesClick({dataKey: series.label});
        });
    };
    let renderedAreas = series.map(renderSeries);
    if (!renderedSeriesOnce && isolatedSeries.length > 0) {
        setIsolatedSeries([]);
        renderedAreas = series.map(renderSeries);
    }

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
            <linearGradient id={series.labelId} x1='0' y1='0' x2='0' y2='1' key={series.label}>
                <stop offset='5%' stopColor={labelColors[series.label]} stopOpacity={0.8}/>
                <stop offset='95%' stopColor={labelColors[series.label]} stopOpacity={0.1}/>
            </linearGradient>
        );
    };
    const renderedGradients = series.map(renderGradient);

    const renderLegendItem = value => {
        let weight = 300;
        if (isolatedSeries.includes(value))
            weight = 500;
        return <span title={value} style={{fontWeight: weight, cursor: 'pointer', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
            {value}
            </span>;
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
        <ResponsiveContainer width='100%' height='100%'>
            <ReChart data={data} syncId={getCurrentTab()} margin={{top: 45, right: 15, left: 15, bottom: 5}}>
                <XAxis
                    dataKey='xLabel'
                    tick={{fill: '#a0a0a0', fontSize: 12}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={8}
                    axisLine={{stroke: '#a0a0a0'}}
                    label={{value: xLabel, position: 'insideBottomRight', offset: -5, fill: '#dadada'}}
                />
                <YAxis
                    yAxisId='left'
                    tickFormatter={formatter}
                    domain={leftDomain}
                    tick={{fill: '#a0a0a0', fontSize: 12}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={8}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale={leftScale}
                    label={({ viewBox }) => <AxisLabel offset={8} axisType="yAxis" {...viewBox}>{yLabel}</AxisLabel>}
                />
                <YAxis
                    yAxisId='right'
                    orientation='right'
                    hide={!showRightAxis}
                    tickFormatter={formatter}
                    domain={rightDomain}
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={8}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale={rightScale}
                    label={({ viewBox }) => <AxisLabel offset={55} axisType="yAxis" {...viewBox}>{rightYLabel}</AxisLabel>}
                />
                <Tooltip formatter={formatter} content={<RenderTooltip/>}/>
                <Legend onClick={seriesClick} formatter={renderLegendItem} payload={legendPayload} content={ScrollableLegend}/>
                <defs>
                    {renderedGradients}
                </defs>
                {renderedAreas}
                {minY < 0 && <ReferenceLine yAxisId='left' y={0} stroke='white' strokeDasharray='3 3'/>}
            </ReChart>
        </ResponsiveContainer>
    );
}

export default ComposedChart;
