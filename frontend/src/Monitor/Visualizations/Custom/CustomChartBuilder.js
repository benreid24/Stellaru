import React, {useState, useEffect} from 'react';

import TimeseriesProperties from './TimeseriesProperties';
import TimeSeriesCreator from './TimeSeriesCreator';
import ScatterProperties from './ScatterProperties';
import ScatterCreator from './ScatterCreator';
import PieProperties from './PieProperties';
import PieCreator from './PieCreator';
import CustomChart from './CustomChart';
import {chartExists, addChart, deleteChart, getChart} from './CustomChartRepository';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import './Custom.css';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '45%',
    },
    button: {
        width: '20%',
        marginRight: theme.spacing(2)
    },
    newButton: {
        marginRight: '10%',
        height: '75%'
    }
}));

const defaultChart = {
    name: '',
    type: 'timeseries', // scatter | pie
    title: '',
    scatter: {
        xAxisLabel: '',
        yAxisLabel: '',
        radiusLabel: '',
        x: [], //selector path
        y: [], //selector path
        radius: [], //selector path
        label: [] //selector path
    },
    timeseries: {
        xAxisLabel: '',
        leftAxisLabel: '',
        leftScale: 'linear', // log | sqrt
        rightAxisLabel: '',
        rightScale: 'linear', // log | sqrt
        x: ['date_days'], //selector path
        y: [
            /*{
                data: ['path'],
                label: 'label',
                axis: 'right | left'
            }*/
            // etc
        ]
    },
    pie: {
        label: 'label', // label | value | none
        sections: [
            /*{
                data: ['path'],
                label: 'label'
            },*/
            // etc
        ]
    }
};

function CustomChartBuilder(props) {
    const classes = useStyles();
    const data = props.data;
    const refresh = name => {
        if (props.refresh)
            props.refresh(name);
    };

    const [dirty, setDirty] = useState(false);
    const [chart, setChart] = useState(props.chart && props.chart !== -1 ? getChart(props.chart) : defaultChart);
    useEffect(() => {
        if (props.chart && chartExists(props.chart))
            setChart(getChart(props.chart));
    }, [props.chart]);

    const setChartWrapper = chart => {
        setDirty(true);
        setChart(chart);
    }

    const onNameChange = event => {
        setChart({
            ...chart,
            name: event.target.value
        });
        refresh(event.target.value);
        setDirty(true);
    };

    const onTitleChange = event => {
        setChart({
            ...chart,
            title: event.target.value
        });
        setDirty(true);
    };

    const onTypeChange = event => {
        setChart({
            ...chart,
            type: event.target.value
        });
        setDirty(true);
    };

    const onSave = () => {
        addChart(chart);
        refresh(chart.name);
        setDirty(false);
        setChart({
            ...chart,
            name: chart.name
        }); // force render to update save button
    };

    const onDelete = () => {
        deleteChart(chart);
        setChart(defaultChart);
        setDirty(false);
        refresh();
    };

    const onNew = () => {
        setDirty(false);
        setChart(defaultChart);
    };

    return (
        <div>
            <div className='row chartRow justify-content-center'>
                <div className='col-xl-6 col-md-8 col-xs-12'>
                    <div className='customChartArea'>
                        <CustomChart data={data} chart={chart}/>
                    </div>
                </div>
            </div>
            <div className='row chartRow'>
                <div className='col-4'>
                    <div className='customChartTypeArea'>
                        <Button variant="contained" color={dirty ? 'secondary' : 'primary'} className={classes.newButton} onClick={onNew}>New Chart</Button>
                        <Select value={chart.type} onChange={onTypeChange}>
                            <MenuItem value='timeseries'>Time Series</MenuItem>
                            <MenuItem value='scatter'>Scatter</MenuItem>
                            <MenuItem value='pie'>Pie</MenuItem>
                        </Select>
                    </div>
                    <div className='customChartTypeArea'>
                        <TextField label="Chart Name" onChange={onNameChange} value={chart.name} className={classes.textField}/>
                        <TextField label="Chart Title" onChange={onTitleChange} value={chart.title} className={classes.textField}/>
                    </div>
                    <div className='customChartPropsArea'>
                        {chart.type === 'timeseries' && <TimeseriesProperties chart={chart} setChart={setChartWrapper}/>}
                        {chart.type === 'scatter' && <ScatterProperties chart={chart} setChart={setChartWrapper}/>}
                        {chart.type === 'pie' && <PieProperties chart={chart} setChart={setChartWrapper}/>}
                    </div>
                    <div className='customChartSaveArea'>
                        {chart.name.length > 0 && dirty && 
                            <Button variant="contained" color="primary" className={classes.button} onClick={onSave}>
                                {chartExists(chart.name) ? 'Overwrite' : 'Create'}
                            </Button>
                        }
                        {chartExists(chart.name) &&
                            <Button variant="contained" color="secondary" className={classes.button} onClick={onDelete}>Delete</Button>
                        }
                    </div>
                </div>
                <div className='col-8'>
                    <div className='customSeriesArea'>
                        {chart.type === 'timeseries' && <TimeSeriesCreator data={data} chart={chart} setChart={setChartWrapper}/>}
                        {chart.type === 'scatter' && <ScatterCreator data={data} chart={chart} setChart={setChartWrapper}/>}
                        {chart.type === 'pie' && <PieCreator data={data} chart={chart} setChart={setChartWrapper}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomChartBuilder;
