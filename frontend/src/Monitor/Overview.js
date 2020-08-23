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
                <div className='col-3'>
                    <Standing data={data} height={350}/>
                </div>
                <div className='col-5'>
                    <NetResourceIncome data={data} height={205}/>
                </div>
                <div className='col-4'>
                    <RawScienceOutput data={data} height={257}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    <FancyBreakdown data={data} height={190}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
