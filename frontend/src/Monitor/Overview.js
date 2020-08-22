import React from 'react';

import NetResourceIncome from './Charts/Economy/NetResourceIncome';
import RawScienceOutput from './Charts/Science/RawScienceOutput';

function Overview(props) {
    const data = props.data;

    return (
        <div className='row'>
            <div className='col-4'>
                <NetResourceIncome data={data} height={200}/>
            </div>
            <div className='col-4'>
                <RawScienceOutput data={data} height={200}/>
            </div>
        </div>
    );
}

export default Overview;
