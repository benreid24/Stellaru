import React, {useState} from 'react';

import {VictoryArea} from 'victory';

import TimeSeries from './TimeSeries';
import {getDataColors, selectNested, valueTickFormat, addAlphaChannel} from './Util';

import './Charts.css';

function StackedAreaChart(props) {
    const data = props.data;
    const renderLabel = props.showLabels;

    let areas = [...props.areas];
    const labelColors = getDataColors(areas.map(area => area.label));
    let y0s = {};

    const prepArea = area => {
        const areaData = data.map(snap => {
            const x = selectNested('date_days', snap);
            const y = area.selector(snap);
            const y0 = x in y0s ? y0s[x] : 0;
            y0s[x] = y0 + y;
            return {
                x: x,
                y: y + y0,
                y0: y0
            };
        });
        if (areaData.length > 0 && renderLabel) {
            let value = Math.round(areaData[areaData.length-1].y);
            areaData[areaData.length-1].label = valueTickFormat(value);
        }
        return areaData;
    };

    areas = areas.map(area => {return {...area, data: prepArea(area)}});

    const renderArea = area => {
        return (
            <VictoryArea
                key={area.label}
                name={area.label}
                style={{
                    data: {stroke: labelColors[area.label], fill: addAlphaChannel(labelColors[area.label], 0.2)},
                    labels: {fill: '#d2d2d2'}
                }}
                data={area.data}
            />
        );
    };

    return (
        <TimeSeries
            data={data}
            height={props.height}
            title={props.title}
            titleColor={props.titleColor}
            yAxisLabel={props.yAxisLabel}
            labelColors={labelColors}
            series={areas}
            seriesRenderer={renderArea}
            onLegendClick={props.onAreaClick ? props.onAreaClick : ()=>{}}
            padding={props.padding}
        />
    );
}

export default StackedAreaChart;
