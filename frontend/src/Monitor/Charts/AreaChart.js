import React from 'react';

import ComposedChart from './ComposedChart';
import {getDataColors, renderArea} from './Util';

function AreaChart(props) {
    const rawData = props.data;
    const areas = props.areas;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const labelColors = getDataColors(areas.map(area => area.label));
    const allowIsolation = props.allowIsolation ? true : false;
    const areaClickCb = props.onAreaClick;
    const stack = props.stack ? true : false;

    const renderAreaBound = area => renderArea(area, labelColors[area.label], stack ? '1' : null);

    return (
        <ComposedChart
            data={rawData}
            series={areas}
            yAxisLabel={yLabel}
            allowIsolation={allowIsolation}
            onSeriesClick={areaClickCb}
            seriesRenderer={renderAreaBound}
            labelColors={labelColors}
        />
    );
}

export default AreaChart;
