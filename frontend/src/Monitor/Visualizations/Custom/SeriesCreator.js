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

    return (
        <div className='seriesCreator'>
            <DataSelector dataFormat={dataFormat} series={xSeries} setSeries={setXSeries}/>
        </div>
    );
}

export default SeriesCreator;
