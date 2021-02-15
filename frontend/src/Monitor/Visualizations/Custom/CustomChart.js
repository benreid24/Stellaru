import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import TimeseriesChart from './TimeseriesChart';
import ScatterChart from './ScatterChart';
import PieChart from './PieChart';

function CustomChart(props) {
    const data = props.data;
    const chart = props.chart;
    const overlay = props.overlay; // TODO - figure out edit button

    return (
        <Chart name={chart.name} overlay={overlay} title={chart.title} titleColor='#c5c5c5'>
            {chart.type === 'timeseries' && <TimeseriesChart data={data} chart={chart}/>}
            {chart.type === 'scatter' && <ScatterChart data={data} chart={chart}/>}
            {chart.type === 'pie' && <PieChart data={data} chart={chart}/>}
        </Chart>
    );
}

export default CustomChart;
