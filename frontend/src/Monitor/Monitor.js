import React from 'react';
import {useState, useEffect} from 'react';

import StellaruLines from './Charts/StellaruLines';

import './Monitor.css';

function Monitor(props) {
    const save = props.save;
    const empire = props.empire;
    const subscription = props.socket;
    const [gameData, setGameData] = useState([]);

    const onNewData = (event) => {
        const data = event.data;
        console.log(`Received data from backend: ${data}`);
    };
    subscription.onmessage = onNewData;

    useEffect(() => {
        fetch(
            'api/data', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({empire: empire.id, file: save.file})
            }
        ).then(response => response.json()).then(data => {
            setGameData([data]);
        });
    }, [save, empire]);

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
