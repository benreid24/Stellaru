import React, {useState, useEffect} from 'react';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from '@material-ui/core/styles';

import {getChart, getAllCharts} from '../ChartRegistry';
import {randomString} from '../Charts/Util';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0.5),
        minWidth: 240,
        width: '100%'
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    }
}));

function ChartAdder(props) {
    const classes = useStyles();
    const added = props.charts.map(chart => chart.name);
    const onAdd = event => props.onAdd(event.target.value);

    const allCharts = getAllCharts();
    const makeItem = chart => {
        return (
            <MenuItem key={chart.name} value={chart.name}>
                <Tooltip title={<span className='chartDesc'>{chart.description}</span>} placement='right'>
                    <span>{chart.name}</span>
                </Tooltip>
            </MenuItem>
        );
    }
    const chartList = allCharts.map(makeItem);

    return (    
        <div className='container-fluid'>
            <div className='row justify-content-start'>
                <div className='col-xl-3 col-lg-4 col-md-5 col-sm-6 col-xs-7 align-self-end'>
                    <FormControl className={classes.formControl}>
                        <InputLabel id='add-chart'>Add Chart...</InputLabel>
                        <Select value='' onChange={onAdd} labelId='add-chart'>
                            {chartList}
                        </Select>
                    </FormControl>
                </div>
                {added.length > 0 && 
                    <div className='col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-5 align-self-center'>
                        <Button color='secondary' variant='contained' onClick={props.onClear}>Clear Dashboard</Button>
                    </div>
                }
            </div>
        </div>
    );   
}

function CustomTab(props) {
    const data = props.data;
    const [charts, setCharts] = useState([]);
    const [renderedCharts, setRenderedCharts] = useState([]);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem('stellaruCharts');
            if (saved !== null) {
                setCharts(JSON.parse(saved));
            }
        }
        catch (_) {
            setCharts([]);
        }
    }, []);

    const onAdd = chart => {
        setCharts([...charts, {name: chart, size: 32, height: 37, saveName: randomString(8)}]);
    };
    const onClear = () => {
        setCharts([]);
    };

    useEffect(() => {
        const onDelete = chart => {
            setCharts(charts.reduce((keptCharts, cChart) => {
                if (cChart.saveName !== chart)
                    return [...keptCharts, cChart];
                return keptCharts;
            }, []));
        };
        const onResize = (chart, larger) => {
            setCharts(charts.reduce((newCharts, cChart) => {
                if (cChart.saveName === chart) {
                    cChart.size += larger ? 3 : -3;
                    if (cChart.size > 95)
                        cChart.size = 95;
                    if (cChart.size < 10)
                        cChart.size = 10;
                }
                return [...newCharts, cChart];
            }, []));
        };
        const onChangeHeight = (chart, taller) => {
            setCharts(charts.reduce((newCharts, cChart) => {
                if (cChart.saveName === chart) {
                    cChart.height += taller ? 1 : -1;
                    if (cChart.height > 95)
                        cChart.height = 95;
                    if (cChart.height < 10)
                        cChart.height = 10;
                }
                return [...newCharts, cChart];
            }, []));
        }
        const onMove = (chart, higher) => {
            const i = charts.findIndex(cChart => cChart.saveName === chart);
            if (i >= 0) {
                let newCharts = charts.slice();
                const newI = higher ? i - 1 : i + 1;
                if (newI >= 0 && newI < charts.length) {
                    [newCharts[i], newCharts[newI]] = [newCharts[newI], newCharts[i]];
                    setCharts(newCharts);
                }
            }
        };
        
        const makeOverlay = chart => {
            return {
                onDelete: () => onDelete(chart),
                onResize: larger => onResize(chart, larger),
                onHeight: taller => onChangeHeight(chart, taller),
                onMove: higher => onMove(chart, higher)
            };
        };

        if (charts.length === 0) {
            setRenderedCharts([]);
            return;
        }

        let rendered = [];
        let toRender = charts.slice();
        let currentRow = [];
        let rowWidth = 0;
        let rowHeight = charts[0].height;
        let rowCount = 0;
        const addRow = () => {
            rendered.push(
                <div key={rowCount} className='customRow' style={{height: `${rowHeight}vh`}}>
                    {currentRow}
                </div>
            );
            rowCount += 1;
            currentRow = [];
            rowWidth = 0;
            rowHeight = 0;
        };
        while (toRender.length > 0) {
            const chart = toRender[0];
            if (rowWidth + chart.size > 98) {
                addRow();
            }
            else {
                const Chart = getChart(chart.name).component;
                currentRow.push(
                    <div key={chart.saveName} className={`customColumn`} style={{width: `${chart.size}%`}}>
                        <Chart name={chart.saveName} data={data} overlay={makeOverlay(chart.saveName)}/>
                    </div>
                );
                if (chart.height > rowHeight) rowHeight = chart.height;
                rowWidth += chart.size;
                toRender = toRender.splice(1);
            }
        }
        if (currentRow.length > 0)
            addRow();
        setRenderedCharts(rendered);
    }, [charts, data]);

    useEffect(() => {
        window.localStorage.setItem('stellaruCharts', JSON.stringify(charts));
    }, [charts]);

    return (
        <div className='customTab'>
            <div className='customTabHeader'>
                <ChartAdder onAdd={onAdd} onClear={onClear} charts={charts}/>
            </div>
            <div className='customTabContent'>
                {renderedCharts.length === 0 && <div className='row chartRow justify-content-center'><div className='col-6'><p>Create a custom dashboard by adding charts</p></div></div>}
                {renderedCharts}
            </div>
        </div>
    );
}

export default CustomTab;
