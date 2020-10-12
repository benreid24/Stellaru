import React from 'react';

import ComposedChart from './ComposedChart';
import {renderArea} from './Util';

function AreaChart(props) {
    const name = props.name;
    const rawData = props.data;
    const areas = props.areas;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const rightYLabel = props.rightYLabel ? props.rightYLabel : null;
    const labelColors = props.labelColors;
    const allowIsolation = props.allowIsolation ? true : false;
    const areaClickCb = props.onAreaClick;
    const stack = props.stack ? true : false;

    const renderAreaBound = (area, labelColors, onClick) => {
        return renderArea(area, labelColors[area.label], stack ? '1' : null, onClick);
    };

    return (
        <ComposedChart
            name={name}
            data={rawData}
            series={areas}
            yAxisLabel={yLabel}
            rightYLabel={rightYLabel}
            allowIsolation={allowIsolation}
            onSeriesClick={areaClickCb}
            seriesRenderer={renderAreaBound}
            labelColors={labelColors}
        />
    );
}

export default AreaChart;
