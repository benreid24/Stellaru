import React, {useState, useEffect} from 'react';

import {ComposedChart as ReChart} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';
import {ReferenceLine} from 'recharts';
import {ResponsiveContainer} from 'recharts';
import {YAxis, XAxis} from 'recharts';

import {getCurrentTab} from '../Tabs/CurrentTab';
import {getDataColors, valueTickFormat, selectNested, dateTickFormat, makeId} from './Util';

const AxisLabel = ({axisType, x, y, width, height, stroke, children, offset}) => {
    const isVert = axisType === 'yAxis';
    const cx = isVert ? x : x + (width / 2);
    const cy = isVert ? (height / 2) + y : y + height + 10;
    const rot = isVert ? `270 ${cx} ${cy}` : 0;
    return (
        <text x={cx} y={cy + offset} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke} fill='#dadada'>
            {children}
        </text>
    );
};

function RenderTooltip(props) {
    const payload = props.payload;
    const label = props.label;
    const formatter = props.formatter;

    const renderItem = item => {
        return (
            <p
                key={item.dataKey}
                className='tooltipItem'
                style={{color: item.color}}
            >
                {`${item.name}: ${formatter(item.value)}`}
            </p>
        );
    };
    const renderedItems = payload ? payload.map(renderItem) : [];

    const MaxRows = 14;
    const columnCount = Math.ceil(renderedItems.length / MaxRows);
    let columns = [];
    for (let i = 0; i<columnCount; i += 1) {
        columns.push(
            <div key={i} className='col-auto'>
                {renderedItems.slice(i * MaxRows, i * MaxRows + MaxRows)}
            </div>
        );
    }
    
    return (
        <div className='tooltipBox'>
            <p className='tooltipLabel'>{label}</p>
            <div className='row tooltipRow'>
                {columns}
            </div>
        </div>
    );
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

    const [initialColors, initialShuffled] = getDataColors(series.map(series => series.label));
    const [labelColors, setLabelColors] = useState(props.labelColors ? props.labelColors : initialColors);
    const [shuffleOrder, setShuffledOrder] = useState(initialShuffled);
    useEffect(() => {
        if (!props.labelColors) {
            const [newColors, newShuffled] = getDataColors(series.map(series => series.label), shuffleOrder);
            setLabelColors(newColors);
            setShuffledOrder(newShuffled);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [series]);
    useEffect(() => {
        if (props.labelColors)
            setLabelColors(props.labelColors);
    }, [props.labelColors]);

    //const labelColors = getDataColors(series.map(series => series.label));

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
        return seriesRenderer(series, labelColors, () => {
            seriesClick({dataKey: series.label});
        });
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
        <ResponsiveContainer width='100%' height='100%'>
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
                    tickFormatter={formatter}
                    domain={leftDomain}
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale='linear'
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
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    interval='preserveStartEnd'
                    scale='linear'
                    label={({ viewBox }) => <AxisLabel offset={55} axisType="yAxis" {...viewBox}>{rightYLabel}</AxisLabel>}
                />
                <Tooltip formatter={formatter} content={<RenderTooltip/>}/>
                <Legend onClick={seriesClick} formatter={renderLegend} payload={legendPayload}/>
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
