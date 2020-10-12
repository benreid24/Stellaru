import React from 'react';

import LeadingFederation from '../Charts/Federation/Leader';
import FederationMembers from '../Charts/Federation/Members';
import FederationExperience from '../Charts/Federation/Experience';

function Federation(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <LeadingFederation data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 chartCol presetChart'>
                    <FederationMembers data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12chartCol presetChart'>
                    <FederationExperience data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Federation;
