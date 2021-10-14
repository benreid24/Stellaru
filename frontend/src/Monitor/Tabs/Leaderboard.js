import React from 'react';
import {LeaderboardContextProvider} from '../Leaderboard/Context';

function Leaderboard(props) {
    const data = props.data;

    return (
        <LeaderboardContextProvider data={data}>
            <div className='monitorTab'>
                <div className='row chartRow'>
                    Leaderboard here
                </div>
            </div>
        </LeaderboardContextProvider>
    );
}

export default Leaderboard;
