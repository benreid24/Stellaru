import React, {useState, useEffect} from 'react';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from '@material-ui/core/styles';

import {getChart, getAllCharts} from './ChartRegistry';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0.5),
        minWidth: 240,
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
        if (added.includes(chart.name))
            return null;
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
            <div className='row'>
                <div className='col-auto align-self-end'>
                    <FormControl className={classes.formControl}>
                        <InputLabel id='add-chart'>Add Chart...</InputLabel>
                        <Select value='' onChange={onAdd} labelId='add-chart'>
                            {chartList}
                        </Select>
                    </FormControl>
                </div>
            {added.length > 0 && 
                <div className='col align-self-center'>
                    <Button color='secondary' variant='contained' onClick={props.onClear}>Clear Dashboard</Button>
                </div>
            }
        </div>
    );   
}

function CustomTab(props) {
    const data = props.data;
    const [charts, setCharts] = useState([]);
    const [renderedCharts, setRenderedCharts] = useState([]);

    useEffect(() => {
        const saved = window.localStorage.getItem('stellaruCharts');
        if (saved !== null) {
            setCharts(JSON.parse(saved));
        }
    }, []);

    const onAdd = chart => {
        setCharts([...charts, {name: chart, size: 4}]);
    };
    const onClear = () => {
        setCharts([]);
    };

    useEffect(() => {
        const onDelete = chart => {
            setCharts(charts.reduce((keptCharts, cChart) => {
                if (cChart.name !== chart)
                    return [...keptCharts, cChart];
                return keptCharts;
            }, []));
        };
        const onResize = (chart, larger) => {
            setCharts(charts.reduce((newCharts, cChart) => {
                if (cChart.name === chart) {
                    cChart.size += larger ? 1 : -1;
                    if (cChart.size > 12)
                        cChart.size = 12;
                    if (cChart.size < 1)
                        cChart.size = 1;
                }
                return [...newCharts, cChart];
            }, []));
        };
        const onMove = (chart, higher) => {
            const i = charts.findIndex(cChart => cChart.name === chart);
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
                onMove: higher => onMove(chart, higher)
            };
        };

        let rendered = [];
        for (let i in charts) {
            const chart = charts[i];
            const className = 'mb-3 chartCol col-' + chart.size;
            const Chart = getChart(chart.name).component;
            rendered.push(
                <div className={className} key={chart.name}>
                    <Chart data={data} height={250} overlay={makeOverlay(chart.name)}/>
                </div>
            );
        }
        setRenderedCharts(rendered);
        window.localStorage.setItem('stellaruCharts', JSON.stringify(charts));
    }, [charts, data]);

    let rowClass = 'row';
    if (renderedCharts.length === 0)
        rowClass += ' justify-content-center';
    return (
        <div className='monitorTab'>
            <ChartAdder onAdd={onAdd} onClear={onClear} charts={charts}/>
            <div className={rowClass}>
                {renderedCharts.length === 0 && <div className='col-6'><p>Create a custom dashboard by adding charts</p></div>}
                {renderedCharts}
            </div>
        </div>
    );
}

export default CustomTab;
