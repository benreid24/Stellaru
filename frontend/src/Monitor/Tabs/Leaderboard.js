import React from 'react';
import {TestChart} from '../Leaderboard/Charts/TestChart';

function Leaderboard(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 presetChart'>
                    <TestChart data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
