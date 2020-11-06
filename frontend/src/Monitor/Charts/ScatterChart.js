import React from 'react';

import {ResponsiveContainer} from 'recharts';
import {ScatterChart as ReChart, Scatter} from 'recharts';
import {YAxis, XAxis, ZAxis} from 'recharts';
import {Legend} from 'recharts';
import {Tooltip} from 'recharts';

import {getDataColors, valueTickFormat} from './Util';
import {AxisLabel, ScrollableLegend} from './CustomComponents';

function ScatterChart(props) {
    const data = props.data;
    const items = props.items;
    const xLabel = props.xLabel;
    const yLabel = props.yLabel;
    const radiusLabel = props.radiusLabel;
    const xFormatter = props.xFormatter ? props.xFormatter : valueTickFormat;
    const yFormatter = props.yFormatter ? props.yFormatter : valueTickFormat;
    const radiusFormatter = props.radiusFormatter ? props.radiusFormatter : valueTickFormat;
    const xAxisType = props.xAxisType ? props.xAxisType : 'number';
    const yAxisType = props.yAxisType ? props.yAxisType : 'number';

    const labelColors = getDataColors(items.map(item => item.label))[0];

    const renderScatter = item => {
        const point = {
            label: item.label,
            x: item.xSelector(data[data.length-1]),
            y: item.ySelector(data[data.length-1]),
            z: item.radiusSelector(data[data.length-1]),
        };
        return <Scatter key={item.label} data={[point]} name={item.label} fill={labelColors[item.label]}/>;
    };
    const renderedScatters = data.length > 0 ? items.map(renderScatter) : [];

    const RenderTooltip = props => {
        let payload = props.payload;
        if (!payload || payload.length !== 3) return <div></div>;
        payload = payload[0].payload;
        const color = labelColors[payload.label];
        
        return (
            <div className='tooltipBox'>
                <p className='tooltipLabel'>{payload.label}</p>
                <p className='tooltipItem' style={{color: color}}>
                    {xLabel}: {xFormatter(payload.x)}
                </p>
                <p className='tooltipItem' style={{color: color}}>
                    {yLabel}: {yFormatter(payload.y)}
                </p>
                <p className='tooltipItem' style={{color: color}}>
                    {radiusLabel}: {radiusFormatter(payload.z)}
                </p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width='100%' height='100%'>
            <ReChart margin={{top: 45, right: 15, left: 15, bottom: 20}}>
                <XAxis
                    tickFormatter={xFormatter}
                    dataKey='x'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    label={{value: xLabel, position: 'insideBottomRight', offset: 0, fill: '#dadada'}}
                    type={xAxisType}
                />
                <YAxis
                    tickFormatter={yFormatter}
                    dataKey='y'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    label={({ viewBox }) => <AxisLabel offset={8} axisType="yAxis" {...viewBox}>{yLabel}</AxisLabel>}
                    type={yAxisType}
                />
                <ZAxis
                    tickFormatter={radiusFormatter}
                    dataKey='z'
                    tick={{fill: '#a0a0a0'}}
                    tickLine={{stroke: '#a0a0a0'}}
                    tickSize={9}
                    axisLine={{stroke: '#a0a0a0'}}
                    label={radiusLabel}
                    range={[60, 600]}
                />
                <Legend content={ScrollableLegend}/>
                <Tooltip content={<RenderTooltip/>}/>
                {renderedScatters}
            </ReChart>
        </ResponsiveContainer>
    )
}

export default ScatterChart;
