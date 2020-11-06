import React from 'react';

import EmpireSize from 'Monitor/Visualizations/Empire/EmpireSize';
import Colonies from 'Monitor/Visualizations/Empire/Colonies';
import ColonySizes from 'Monitor/Visualizations/Empire/ColonySizes';
import ColonyStability from 'Monitor/Visualizations/Empire/ColonyStability';
import ColonyTypes from 'Monitor/Visualizations/Empire/ColonyTypes';
import ColonyScatter from 'Monitor/Visualizations/Empire/ColonyScatter';

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
                    <ColonyScatter data={data}/>
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
