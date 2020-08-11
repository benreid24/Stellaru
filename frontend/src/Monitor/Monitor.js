import React from 'react';

import StellaruLines from './Charts/StellaruLines';

import './Monitor.css';

function Monitor(props) {
    const save = props.save;
    const empire = props.empire;

    return (
        <div>
            <h1 className='empireName'>
                {empire.name}<span className='playerName'>({empire.player})</span>
            </h1>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-3'/>
                    <div className='col-6'>
                        <StellaruLines/>
                    </div>
                    <div className='col-3'/>
                </div>
            </div>
        </div>
    )
}

export default Monitor;
