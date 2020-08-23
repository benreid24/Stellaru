import React from 'react';

import Standing from './Charts/General/Standing';
import NetResourceIncome from './Charts/Economy/NetResourceIncome';
import RawScienceOutput from './Charts/Science/RawScienceOutput';
import FancyBreakdown from './Charts/Economy/FancyBreakdown';

function Overview(props) {
    const data = props.data;

    return (
        <div>
            <div className='row'>
                <div className='col-xl-5 col-lg-12 mb-3'>
                    <NetResourceIncome data={data} height={180}/>
                </div>
                <div className='col-xl-3 col-lg-6 col-md-12 mb-3'>
                    <Standing data={data} height={320}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3'>
                    <RawScienceOutput data={data} height={230}/>
                </div>
                <div className='col-xl-6 col-lg-12 mb-3'>
                    <FancyBreakdown data={data} height={190}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
