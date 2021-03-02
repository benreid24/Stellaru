import React from 'react';

import Chart from 'Monitor/Charts/PieChart';
import {selectNested, findKeysOverSeries, valueTickFormat} from 'Monitor/Charts/Util';
import {makeLabelFromKey} from './CustomChartRepository';

function PieChart(props) {
    const data = props.data;
    const chart = props.chart;
    const pie = chart.pie;

    const generateSections = series => {
        const i = series.data.indexOf(null);
        if (i < 0) {
            return [{
                value: selectNested(series.data.join('/'), data[data.length-1]),
                label: series.label
            }];
        }
        else {
            const keys = findKeysOverSeries(data, series.data.slice(0, i).join('/'));
            return keys.map(key => {
                const path = [...series.data.slice(0, i), key, ...series.data.slice(i + 1)].join('/');
                return {
                    value: selectNested(path, data[data.length-1]),
                    label: makeLabelFromKey(key, path, data[data.length-1])
                };
            });
        }
    };
    const sections = pie.sections.map(generateSections).flat();

    const labeler = data => {
        if (pie.label === 'label')
            return data.label;
        else if (pie.label === 'value')
            return valueTickFormat(data.payload.value);
        return '';
    };

    return (
        <Chart
            name={chart.name}
            sections={sections}
            label={pie.label !== 'none' ? labeler : false}
        />
    );
}

export default PieChart;
