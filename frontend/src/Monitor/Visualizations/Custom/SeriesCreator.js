import React, {useState} from 'react';
import DataSelector from './DataSelector';

import {getSeriesKeyBreakdown} from './CustomChartRepository';

function SeriesCreator(props) {
    const data = props.data;
    const dataFormat = getSeriesKeyBreakdown(data);

    const [xSeries, setXSeries] = useState({
        data: [],
        axis: 'x',
        label: ''
    });

    const [ySeries, setYSeries] = useState({
        data: [],
        axis: 'left',
        label: ''
    });

    return (
        <div className='seriesCreator'>
            <DataSelector dataFormat={dataFormat} series={xSeries} setSeries={setXSeries}/>
            <DataSelector dataFormat={dataFormat} series={ySeries} setSeries={setYSeries}/>
        </div>
    );
}

export default SeriesCreator;
