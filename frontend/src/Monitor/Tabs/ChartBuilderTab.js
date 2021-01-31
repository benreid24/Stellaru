import React from 'react';

import CustomChartBuilder from 'Monitor/Visualizations/Custom/CustomChartBuilder';

function ChartBuilder(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <CustomChartBuilder data={data}/>
        </div>
    );
}

export default ChartBuilder;
