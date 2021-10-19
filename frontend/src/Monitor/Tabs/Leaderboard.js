import React from 'react';
import {TechProgressChart} from '../Leaderboard/Charts/TechProgress';
import {FleetPowerChart} from '../Leaderboard/Charts/FleetPower';
import {GDPChart} from '../Leaderboard/Charts/GDP';
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
                    <FleetPowerChart data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <TechProgressChart data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <GDPChart data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <EmpireSize data={data}/>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-12 mb-3 leaderboardChart'>
                    <VictoryChart data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
