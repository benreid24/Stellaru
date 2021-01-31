import React, {useState} from 'react';

import CustomChartProperties from './CustomChartProperties';
import SeriesCreator from './SeriesCreator';

import './Custom.css';

function CustomChartBuilder(props) {
    const data = props.data;

    const [chartProps, setChartProps] = useState({
        title: 'Chart Title',
        xAxisLabel: 'X Label',
        xAxisScaleType: 'X Scale Type',
        leftAxisLabel: 'Left Y Label',
        rightYLabel: 'Right Y Label',
        leftAxisScaleType: 'Left Scale Type', // TODO - dropdown
        rightAxisScaleType: 'Right Scale Type'
    });

    const onChartSave = () => {
        console.log(`Chart saved:`);
        console.log(chartProps);
    };

    return (
        <div>
            <div className='row chartRow justify-content-center'>
                <div className='col-xl-6 col-md-8 col-xs-12'>
                    <div className='placeholder customChartArea'>
                        <p>Chart preview</p>
                    </div>
                </div>
            </div>
            <div className='row chartRow'>
                <div className='col-6'>
                    <CustomChartProperties chartProps={chartProps} setChartProps={setChartProps} onSave={onChartSave}/>
                </div>
                <div className='col-6'>
                    <div className='customSeriesArea'>
                        <SeriesCreator data={data}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomChartBuilder;
