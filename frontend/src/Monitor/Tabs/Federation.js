import React from 'react';

import LeadingFederation from 'Monitor/Visualizations/Federation/Leader';
import FederationMembers from 'Monitor/Visualizations/Federation/Members';
import FederationExperience from 'Monitor/Visualizations/Federation/Experience';

function Federation(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <LeadingFederation data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <FederationMembers data={data}/>
                </div>
                <div className='col-12 presetChart'>
                    <FederationExperience data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Federation;
