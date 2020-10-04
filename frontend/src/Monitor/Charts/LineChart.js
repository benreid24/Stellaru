import React from 'react';

import ComposedChart from './ComposedChart';
import {getDataColors, renderLine} from './Util';

function LineChart(props) {
    const rawData = props.data;
    const lines = props.lines;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const labelColors = getDataColors(lines.map(line => line.label));

    const renderLineBound = line => renderLine(line, labelColors[line.label]);

    return (
        <ComposedChart
            data={rawData}
            series={lines}
            yLabel={yLabel}
            allowIsolation={true}
            seriesRenderer={renderLineBound}
            labelColors={labelColors}
        />
    );
}

export default LineChart;
