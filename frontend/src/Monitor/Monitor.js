import React from 'react';
import {useState, useEffect} from 'react';

import {Tabs, Tab} from '@material-ui/core';

import Overview from './Overview';

import './Monitor.css';

function TabPanel(props) {
    const currentTab = props.value;
    const index = props.index;
    const display = currentTab === index ? 'block' : 'none';

    return (
        <div style={{display: display, paddingTop: '5px'}}>
            {currentTab === index && props.children}
        </div>
    );
}

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
    const [status, setStatus] = useState(subscription.readyState === 1 ? 'WAITING' : 'Disconnected');
    const [currentTab, setCurrentTab] = useState(0);

    const onNewData = (event) => {
        const data = JSON.parse(event.data);
        if ('snap' in data) {
            let snaps = gameData.slice();
            snaps.push(data['snap']);
            setGameData(snaps);
        }
        else if ('status' in data)
            setStatus(data['status']);
    };
    subscription.onmessage = onNewData;
    subscription.onerror = () => setStatus('Error');
    subscription.onclose = () => setStatus('Disconnected');

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
        <div className='container-fluid monitor'>
            <div className='row' style={{paddingBottom: '0px'}}>
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
            <Tabs value={currentTab} onChange={(_, newTab) => setCurrentTab(newTab)}>
                <Tab label='Overview'/>
                <Tab label='Economy'/>
                <Tab label='Military'/>
                <Tab label='Science'/>
                <Tab label='Construction'/>
                <Tab label='Society'/>
            </Tabs>
            <TabPanel value={currentTab} index={0}>
                <Overview data={gameData}/>
            </TabPanel>
        </div>
    );
}

export default Monitor;
