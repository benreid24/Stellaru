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
                <div className='col-4'>
                    <Standing data={data} height={200}/>
                </div>
                <div className='col-4'>
                    <NetResourceIncome data={data} height={200}/>
                </div>
                <div className='col-4'>
                    <RawScienceOutput data={data} height={200}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-4'>
                    <FancyBreakdown data={data} height={200}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
