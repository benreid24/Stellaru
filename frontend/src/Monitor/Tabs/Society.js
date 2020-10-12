import React from 'react';

import Pops from '../Charts/Society/Pops';
import Jobs from '../Charts/Society/Jobs';
import Leaders from '../Charts/Society/Leaders';
import LeaderStats from '../Charts/Society/LeaderStats';
import LeaderGender from '../Charts/Society/LeaderGender';

function Society(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <Pops data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <Jobs data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 chartCol presetChart'>
                    <Leaders data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 chartCol presetChart'>
                    <LeaderStats data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 chartCol presetChart'>
                    <LeaderGender data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Society;
