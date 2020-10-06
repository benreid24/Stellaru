import React from 'react';

import AllResourceIncomes from '../Charts/Economy/AllResourceIncomes';
import Stockpiles from '../Charts/Economy/Stockpiles';
import FancyBreakdown from '../Charts/Economy/FancyBreakdown';

function Overview(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <AllResourceIncomes data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <Stockpiles data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 chartCol presetChart'>
                    <FancyBreakdown data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 chartCol presetChart'>
                    <FancyBreakdown spending data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
