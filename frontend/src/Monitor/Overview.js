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
                <div className='col-3 chartRow'>
                    <Standing data={data} height={350}/>
                </div>
                <div className='col-5 chartRow'>
                    <NetResourceIncome data={data} height={205}/>
                </div>
                <div className='col-4 chartRow'>
                    <RawScienceOutput data={data} height={257}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-6 chartRow'>
                    <FancyBreakdown data={data} height={200}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
