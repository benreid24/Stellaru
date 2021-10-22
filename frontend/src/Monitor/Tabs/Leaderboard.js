import React from 'react';
import {TechProgressChart} from '../Leaderboard/Charts/TechProgress';
import {FleetPowerChart} from '../Leaderboard/Charts/FleetPower';
import {ResourceValueChart} from '../Leaderboard/Charts/ResourceValue';
import {EmpireSize} from '../Leaderboard/Charts/EmpireSize';
import {StatusBoard} from '../Leaderboard/StatusBoard';
import { VictoryChart } from 'Monitor/Leaderboard/Charts/Victory';

function Leaderboard(props) {
    const data = props.data;

    return (
        <div className='leaderboardTab'>
            <StatusBoard data={data}/>
            <div className='row chartRow'>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <VictoryChart data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <FleetPowerChart data={data}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <TechProgressChart data={data}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <ResourceValueChart data={data}/>
                </div>
                <div className='col-xl-4 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <EmpireSize data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
