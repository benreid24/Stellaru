import React from 'react';

import ComposedChart from './ComposedChart';
import {renderLine} from './Util';

function LineChart(props) {
    const name = props.name;
    const rawData = props.data;
    const lines = props.lines;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const rightYLabel = props.rightYLabel ? props.rightYLabel : null;
    const formatter = props.formatter;
    const labelColors = props.labelColors;

    const renderLineBound = (line, labelColors, onClick) => renderLine(line, labelColors[line.label], onClick);

    return (
        <ComposedChart
            name={name}
            data={rawData}
            series={lines}
            yAxisLabel={yLabel}
            rightYLabel={rightYLabel}
            formatter={formatter}
            allowIsolation={true}
            seriesRenderer={renderLineBound}
            labelColors={labelColors}
        />
    );
}

export default LineChart;
