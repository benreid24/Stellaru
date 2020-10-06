import React from 'react';

import Armies from '../Charts/Military/Armies';
import Ships from '../Charts/Military/Ships';
import FleetShips from '../Charts/Military/FleetShips';
import FleetPower from '../Charts/Military/FleetPower';

function Military(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <FleetPower data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <Ships data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 chartCol presetChart'>
                    <Armies data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 chartCol presetChart'>
                    <FleetShips data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Military;
