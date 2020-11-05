import React from 'react';

import Standing from 'Monitor/Visualizations/General/Standing';
import NetResourceIncome from 'Monitor/Visualizations/Economy/NetResourceIncome';
import ScienceOutput from 'Monitor/Visualizations/Science/ScienceOutput';
import FancyBreakdown from 'Monitor/Visualizations/Economy/FancyBreakdown';
import WarOveriview from 'Monitor/Visualizations/Military/WarOverview';
import Comparisons from 'Monitor/Visualizations/General/Comparisons';

function Overview(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-5 col-md-6 col-xs-12 mb-3 presetChart'>
                    <NetResourceIncome data={data}/>
                </div>
                <div className='col-xl-4 col-md-6 col-xs-12 mb-3 presetChart'>
                    <FancyBreakdown data={data} name='overviewbreakdown'/>
                </div>
                <div className='col-xl-3 col-md-6 col-xs-12 mb-3 presetChart'>
                    <WarOveriview data={data}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3 presetChart'>
                    <Standing data={data}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3 presetChart'>
                    <Comparisons data={data}/>
                </div>
                <div className='col-xl-4 col-md-6 col-xs-12 presetChart'>
                    <ScienceOutput data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
