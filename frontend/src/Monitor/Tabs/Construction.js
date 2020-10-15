import React from 'react';

import AllConstruction from '../Charts/Construction/AllConstruction';
import ConstructionQueues from '../Charts/Construction/ConstructionQueues';
import ConstructionBreakdown from '../Charts/Construction/Construction';
import ConstructionQueueStats from '../Charts/Construction/ConstructionQueueStats';

function Construction(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <AllConstruction data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <ConstructionQueues data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 presetChart'>
                    <ConstructionQueueStats data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 presetChart'>
                    <ConstructionBreakdown data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Construction;
