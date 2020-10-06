import React from 'react';

import Standing from '../Charts/General/Standing';
import NetResourceIncome from '../Charts/Economy/NetResourceIncome';
import ScienceOutput from '../Charts/Science/ScienceOutput';
import FancyBreakdown from '../Charts/Economy/FancyBreakdown';
import WarOveriview from '../Charts/Military/WarOverview';

function Overview(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row'>
                <div className='col-xl-5 col-lg-12 mb-3 chartCol presetChart'>
                    <NetResourceIncome data={data}/>
                </div>
                <div className='col-xl-3 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <Standing data={data}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <ScienceOutput data={data}/>
                </div>
                <div className='col-xl-6 col-lg-12 chartCol presetChart'>
                    <FancyBreakdown data={data}/>
                </div>
                <div className='col-xl-6 col-lg-8 col-sm-10 col-xs-12 chartCol presetChart'>
                    <WarOveriview data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
