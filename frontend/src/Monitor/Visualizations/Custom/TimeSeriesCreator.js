import React, {useState} from 'react';
import DataSelector from './DataSelector';

import {getSeriesKeyBreakdown} from './CustomChartRepository';

function TimeSeriesCreator(props) {
    const data = props.data;
    const dataFormat = getSeriesKeyBreakdown(data);

    const xAxisOptions = [{value: 'x', name: 'x'}];
    const yAxisOptions = [{value: 'left', name: 'y (left)'}, {value: 'right', name: 'y (right)'}];

    const [xSeries, setXSeries] = useState([]);

    const [ySeries, setYSeries] = useState({
        data: [],
        axis: 'left',
        type: 'line',
        label: ''
    });
    const setYData = data => {
        setYSeries({
            ...ySeries,
            data: data
        });
    };

    // TODO - onDelete

    return (
        <div className='seriesCreator'>
            <DataSelector dataFormat={dataFormat} data={xSeries} setData={setXSeries} axisTypes={xAxisOptions}/>
            <DataSelector
                dataFormat={dataFormat}
                series={ySeries}
                setSeries={setYSeries}
                data={ySeries.data}
                setData={setYData}
                axisTypes={yAxisOptions}
                label
                timeseries
                onDelete
            />
        </div>
    );
}

export default TimeSeriesCreator;
