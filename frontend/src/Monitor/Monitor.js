import React from 'react';
import {useState, useEffect} from 'react';

import {Tabs, Tab} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import LoadingDots from 'LoadingDots';
import Tips from './Tips';

import Overview from './Tabs/Overview';
import CustomTab from './Tabs/CustomTab';
import Economy from './Tabs/Economy';
import Military from './Tabs/Military';
import Science from './Tabs/Science';
import Society from './Tabs/Society';
import Empire from './Tabs/Empire';
import Construction from './Tabs/Construction';
import Federation from './Tabs/Federation';
import ChartBuilder from './Tabs/ChartBuilderTab';
import Help from './Tabs/Help';

import {dateTickFormat, selectNested} from './Charts/Util';
import {setCurrentTab as setSyncId} from './Tabs/CurrentTab';
import {translate} from 'Translator';

import './Monitor.css';

const MaxDataPoints = 300;

function TabPanel(props) {
    const currentTab = props.value;
    const index = props.index;
    const display = currentTab === index ? 'block' : 'none';

    return (
        <div style={{display: display, paddingTop: '5px', width: '100%', height: '100%'}}>
            {currentTab === index && props.children}
        </div>
    );
}

function StatusIndicator(props) {
    const status = props.status[0].toUpperCase() + props.status.slice(1).toLowerCase();
    let sclass = 'statusIndicatorError';
    let dots = [];
    if (status.includes('Waiting'))
        sclass = 'statusIndicatorGood';
    else if (status.includes('Loading') || status.includes('Polling'))
        sclass = 'statusIndicatorLoading';
    if (!status.includes('Disconnected'))
        dots.push(<LoadingDots key='dots'/>);
    return (
        <div className='statusIndicator'>
            <div className={sclass}>
                <h2 className={sclass+'Text'}>{translate(status)}{dots}</h2>
            </div>
        </div>
    );
}

function DateSlider(props) {
    const gameData = props.data;
    const onChange = props.onChange;
    const [dateRange, setDateRange] = useState([0, 0]);
    const [atEnd, setAtEnd] = useState(true);

    useEffect(() => {
        let newDateRange = dateRange.slice();
        if (atEnd || newDateRange[0] === newDateRange[1]) {
            newDateRange[1] = gameData.length;
            setDateRange(newDateRange);
            onChange(newDateRange);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameData]);

    const debouncedUpdate = () => {
        onChange(dateRange);
    }

    const onDateRangeChange = (_, newValue) => {
        if (newValue[1] > newValue[0]) {
            setDateRange(newValue);
            setAtEnd(newValue[1] === gameData.length);
        }
    };

    let dateMarks = [];
    if (gameData.length > 1 && dateRange[0] !== dateRange[1]) {
        let ticks = [];
        if (dateRange[0] / gameData.length >= 0.1 && dateRange[0] > 1)
            ticks.push(0);
        ticks.push(dateRange[0]);
        ticks.push(dateRange[1]);
        if (dateRange[1] / gameData.length <= 0.9 && dateRange[1] < gameData.length - 1)
            ticks.push(gameData.length-1);
        dateMarks = ticks.map(i => {
            return {
                value: i,
                label: dateTickFormat(selectNested('date_days', gameData[i < gameData.length ? i : gameData.length - 1]))
            };
        });
    }

    return (
        <div className='col dateSlider'>
            <Slider
                track='normal'
                getAriaValueText={dateTickFormat}
                min={0}
                max={gameData.length}
                step={1}
                marks={dateMarks}
                value={dateRange}
                onChange={onDateRangeChange}
                onChangeCommitted={debouncedUpdate}
                color='secondary'
            />
        </div>
    );
}

function Monitor(props) {
    const save = props.save;
    const empire = props.empire;
    const subscription = props.subscription;
    const onBack = props.onBack;

    const [gameData, setGameData] = useState([]);
    const [slicedData, setSlicedData] = useState([]);
    const [dateRange, setDateRange] = useState([0, 0]);
    const [status, setStatus] = useState(subscription.status);
    const [currentTab, setCurrentTab] = useState(0);
    const [connInfo, setConnInfo] = useState(null);

    const onTabChange = (_, newTab) => {
        setCurrentTab(newTab);
        setSyncId(`stellaru-tab-${newTab}`);
    };

    const onNewData = snap => {
        if (gameData.length === 0 || gameData[gameData.length - 1]['date_days'] < snap['date_days']) {
            setGameData([...gameData, snap]);
        }
    };
    subscription.onSnap = onNewData;
    subscription.onStatus = setStatus;

    useEffect(() => {
        fetch('api/conn_info', {method: 'get'}).then(
            response => response.json()
        ).then(data => setConnInfo(data));
    }, []);

    useEffect(() => {
        fetch(
            'api/data', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({empire: empire.id, file: save.file})
            }
        ).then(response => response.json()).then(data => {
            setGameData(data['snaps']);
            setDateRange([0, data['snaps'].length]);
            updateZoom();
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [save, empire]);

    const updateZoom = () => {
        const data = gameData.slice(dateRange[0], dateRange[1]);
        const step = data.length > MaxDataPoints ? Math.floor(data.length / MaxDataPoints) : 1;
        setSlicedData(data.reduce((points, snap, i) => {
            if (i % step === 0 || i === data.length - 1)
                return [...points, snap];
            return points;
        }, []));
    };
    useEffect(updateZoom, [gameData, dateRange]);

    return (
        <div className='container-fluid monitor'>
            <div className='monitorHeader'>
                <div className='row' style={{paddingBottom: '0px'}}>
                    <div className='col-auto align-self-center'>
                        <h1 className='empireName noselect' onClick={onBack} title={translate('Go back to save selection')}>
                            {empire.name}<span className='playerName'>({empire.player})</span>
                        </h1>
                    </div>
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-6 col-xs-6 align-self-end'>
                        <StatusIndicator status={status}/>
                    </div>
                    <DateSlider data={gameData} onChange={setDateRange}/>
                </div>
                <div className='row tabRow'>
                    <div className='col-9'>
                        <Tabs value={currentTab} onChange={onTabChange} variant='scrollable' scrollButtons='auto'>
                            <Tab label={translate('Overview')}/>
                            <Tab label={translate('Custom')}/>
                            <Tab label={translate('Economy')}/>
                            <Tab label={translate('Military')}/>
                            <Tab label={translate('Science')}/>
                            <Tab label={translate('Society')}/>
                            <Tab label={translate('Empire')}/>
                            <Tab label={translate('Federation')}/>
                            <Tab label={translate('Construction')}/>
                            <Tab label={translate('Chart Builder')}/>
                            <Tab label={translate('Help')}/>
                        </Tabs>
                    </div>
                    <div className='col-3'>
                        <Tips/>
                    </div>
                </div>
            </div>
            {slicedData.length > 0 && 
                <div className='monitorContent'>
                    <TabPanel value={currentTab} index={0}>
                        <Overview data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        <CustomTab data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        <Economy data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={3}>
                        <Military data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={4}>
                        <Science data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={5}>
                        <Society data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={6}>
                        <Empire data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={7}>
                        <Federation data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={8}>
                        <Construction data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={9}>
                        <ChartBuilder data={slicedData}/>
                    </TabPanel>
                    <TabPanel value={currentTab} index={10}>
                        <Help connInfo={connInfo}/>
                    </TabPanel>
                </div>
            }
        </div>
    );
}

export default Monitor;
