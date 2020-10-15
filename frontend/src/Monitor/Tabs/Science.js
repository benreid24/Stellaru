import React from 'react';

import ScienceOutput from '../Charts/Science/ScienceOutput';
import Technologies from '../Charts/Science/Technologies';
import Unity from '../Charts/Science/Unity';
import Exploration from '../Charts/Science/Exploration';

function Science(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <ScienceOutput data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <Technologies data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 presetChart'>
                    <Unity data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 presetChart'>
                    <Exploration data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Science;
