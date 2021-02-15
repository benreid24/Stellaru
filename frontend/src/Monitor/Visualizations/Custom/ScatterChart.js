import React from 'react';

import Chart from 'Monitor/Charts/ScatterChart';
import {selectNested, valueTickFormat, dateTickFormat, findKeysOverSeries} from 'Monitor/Charts/Util';

function ScatterChart(props) {
    const data = props.data;
    const chart = props.chart;
    const sc = chart.scatter;

    const xFormat = sc.x.includes('date_days') ? dateTickFormat : valueTickFormat;
    const yFormat = sc.y.includes('date_days') ? dateTickFormat : valueTickFormat;
    const radiusFormat = sc.radius.includes('date_days') ? dateTickFormat : valueTickFormat;

    const generateSelectors = series => {
        if (series.length === 0)
            return [];

        const i = series.indexOf(null);
        if (i < 0) {
            return [snap => selectNested(series.join('/'), snap)];
        }
        else {
            const keys = findKeysOverSeries(data, series.slice(0, i).join('/'));
            return keys.map(key => (snap => selectNested([...series.slice(0, i), key, ...series.slice(i + 1)].join('/'), snap)));
        }
    };
    const xSelects = generateSelectors(sc.x);
    const ySelects = generateSelectors(sc.y);
    const radiusSelects = generateSelectors(sc.radius);
    const labelSelects = generateSelectors(sc.label);

    if (xSelects.length !== ySelects.length || ySelects.length !== radiusSelects.length || radiusSelects.length !== labelSelects.length) {
        return (
            <div style={{paddingTop: '15%'}}>
                <p className='error'>Mismatched number of data items pulled</p>
                <p>X: {xSelects.length}</p>
                <p>Y: {ySelects.length}</p>
                <p>Radius: {radiusSelects.length}</p>
                <p>Labels: {labelSelects.length}</p>
            </div>
        );
    }

    const items = xSelects.map((_, i) => {
        let label = labelSelects[i](data[data.length-1]);
        if (typeof label !== 'string') {
            label = 'INVALID';
        }
        return {
            xSelector: xSelects[i],
            ySelector: ySelects[i],
            radiusSelector: radiusSelects[i],
            label: label
        };
    });

    return (
        <Chart
            name={chart.name}
            data={data}
            items={items}
            yLabel={sc.yAxisLabel}
            xLabel={sc.xAxisLabel}
            xFormatter={xFormat}
            yFormatter={yFormat}
            radiusFormatter={radiusFormat}
        />
    );
}

export default ScatterChart;
