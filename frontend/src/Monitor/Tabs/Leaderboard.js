import React from 'react';
import {TechProgressChart} from '../Leaderboard/Charts/TechProgress';
import {GDPChart} from '../Leaderboard/Charts/GDP';
import {StatusBoard} from '../Leaderboard/StatusBoard';

function Leaderboard(props) {
    const data = props.data;

    return (
        <div className='customTab'>
            <StatusBoard data={data}/>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <TechProgressChart data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <GDPChart data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
