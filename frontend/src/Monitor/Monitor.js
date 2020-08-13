import React from 'react';
import {useState, useEffect} from 'react';

import StellaruLines from './Charts/StellaruLines';

import './Monitor.css';

function StatusIndicator(props) {
    const status = props.status[0].toUpperCase() + props.status.slice(1).toLowerCase();
    let sclass = 'statusIndicatorError';
    if (status === 'Waiting')
        sclass = 'statusIndicatorGood';
    else if (status === 'Loading')
        sclass = 'statusIndicatorLoading';
    return (
        <div className='statusIndicator'>
            <div className={sclass}>
                <h2 className={sclass+'Text'}>{status}</h2>
            </div>
        </div>
    );
}

function Monitor(props) {
    const save = props.save;
    const empire = props.empire;
    const subscription = props.socket;
    const [gameData, setGameData] = useState([]);
    const [status, setStatus] = useState('WAITING');

    const onNewData = (event) => {
        const data = JSON.parse(event.data);
        console.log(`Received data from backend: ${event.data}`);
        if ('snap' in data) {
            let snaps = gameData.slice();
            snaps.push(data['snap']);
            console.log(snaps);
            setGameData(snaps);
        }
        else if ('status' in data)
            setStatus(data['status']);
    };
    subscription.onmessage = onNewData;
    subscription.onerror = () => setStatus('Error');

    useEffect(() => {
        fetch(
            'api/data', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({empire: empire.id, file: save.file})
            }
        ).then(response => response.json()).then(data => {
            setGameData(data['snaps']);
        });
    }, [save, empire]);

    return (
        <div>
            <div className='row'>
                <div className='col-3'></div>
                <div className='col-6'>
                    <h1 className='empireName'>
                        {empire.name}<span className='playerName'>({empire.player})</span>
                    </h1>
                </div>
                <div className='col-1'></div>
                <div className='col-2'>
                    <StatusIndicator status={status}/>
                </div>
            </div>
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
