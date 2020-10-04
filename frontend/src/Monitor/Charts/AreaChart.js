import React, {useState} from 'react';

import {AreaChart as ReAreaChart} from 'recharts';
import {Area} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';
import {XAxis} from 'recharts';
import {YAxis} from 'recharts';
import {ReferenceLine} from 'recharts';
import {ResponsiveContainer} from 'recharts';

import {getDataColors, selectNested, valueTickFormat, dateTickFormat} from './Util';

function AreaChart(props) {
    const rawData = props.data;
    const areas = props.areas;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const labelColors = getDataColors(areas.map(area => area.label));
    const allowIsolation = props.allowIsolation ? true : false;
    const areaClickCb = props.onAreaClick;
    const stack = props.stack ? true : false;

    let minY = 0;
    const data = rawData.map(snap => {
        const x = selectNested('date_days', snap);
        let datum = {
            x: x,
            xLabel: dateTickFormat(x)
        };

        areas.forEach(area => {
            const value = area.selector(snap);
            if (value < minY)
                minY = value - 5;
            datum[area.label] = value;
        });
        return datum;
    });

    const [isolatedAreas, setIsolatedLines] = useState([]);
    const onAreaClick = event => {
        const area = event.dataKey;
        if (areaClickCb)
            areaClickCb(area);
        if (!allowIsolation)
            return;
        if (isolatedAreas.includes(area)) {
            setIsolatedLines(isolatedAreas.filter(l => l !== area));
        }
        else {
            setIsolatedLines([...isolatedAreas, area]);
            if (isolatedAreas.length === areas.length - 1)
                setIsolatedLines([]);
        }
    };
    const areaVisible = area => isolatedAreas.length === 0 || isolatedAreas.includes(area.label);

    const makeId = label => label.replace(/\s/g, '');
    const renderArea = area => {
        if (!areaVisible(area))
            return null;
    
        return (
            <Area
                key={area.label}
                name={area.label}
                dataKey={area.label}
                type='monotone'
                dot={false}
                activeDot
                strokeWidth={1}
                connectNulls={false}
                stroke={labelColors[area.label]}
                fill={`url(#${makeId(area.label)})`}
                stackId={stack ? '1' : null}
            />
        );
    };
    const renderedAreas = areas.map(renderArea);

    const renderGradient = area => {
        return (
            <linearGradient id={makeId(area.label)} x1='0' y1='0' x2='0' y2='1' key={area.label}>
                <stop offset='5%' stopColor={labelColors[area.label]} stopOpacity={0.8}/>
                <stop offset='95%' stopColor={labelColors[area.label]} stopOpacity={0.1}/>
            </linearGradient>
        );
    };
    const renderedGradients = areas.map(renderGradient);

    const renderLegend = value => {
        let weight = 300;
        if (isolatedAreas.includes(value))
            weight = 500;
        return <span style={{fontWeight: weight, cursor: 'pointer'}}>{value}</span>;
    };
    const legendPayload = areas.map(area => {
        return {
            value: area.label,
            type: 'line',
            id: area.label,
            dataKey: area.label,
            color: labelColors[area.label]
        };
    });

    return (
        <ResponsiveContainer>
            <ReAreaChart data={data} margin={{top: 15, right: 15, left: 15, bottom: 5}}>
                <XAxis
                    dataKey='xLabel'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                />
                <YAxis
                    tickFormatter={valueTickFormat}
                    domain={[minY, 'dataMax+5']}
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
            </ReAreaChart>
        </ResponsiveContainer>
    );
}

export default AreaChart;