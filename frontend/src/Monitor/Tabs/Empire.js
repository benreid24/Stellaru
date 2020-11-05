import React from 'react';

import EmpireSize from 'Monitor/Charts/Empire/EmpireSize';
import ColonyAges from 'Monitor/Charts/Empire/ColonyAges';
import Colonies from 'Monitor/Charts/Empire/Colonies';
import ColonySizes from 'Monitor/Charts/Empire/ColonySizes';
import ColonyStability from 'Monitor/Charts/Empire/ColonyStability';
import ColonyTypes from 'Monitor/Charts/Empire/ColonyTypes';

function Empire(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3 presetChart'>
                    <EmpireSize data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3 presetChart'>
                    <ColonyTypes data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3 presetChart'>
                    <ColonyAges data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 presetChart'>
                    <Colonies data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 presetChart'>
                    <ColonyStability data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 presetChart'>
                    <ColonySizes data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Empire;
