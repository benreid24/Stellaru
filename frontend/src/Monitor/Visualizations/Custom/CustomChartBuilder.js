import React, {useState, useEffect} from 'react';

import TimeseriesProperties from './TimeseriesProperties';
import TimeSeriesCreator from './TimeSeriesCreator';
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
    }
}));

const defaultChart = {
    name: '',
    type: 'timeseries', // scatter | pie
    title: '',
    scatter: {
        xAxisLabel: '',
        xScale: 'linear', // log | sqrt
        yAxisLabel: '',
        yScale: 'linear', // log | sqrt
        x: [], //selector path
        y: [], //selector path
        radius: [], //selector path
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
    pie: [
        /*{
            data: ['path'],
            label: 'label'
        },*/
        // etc
    ]
};

function CustomChartBuilder(props) {
    const classes = useStyles();
    const data = props.data;
    const refresh = name => {
        if (props.refresh)
            props.refresh(name);
    };

    const [chart, setChart] = useState(props.chart ? getChart(props.chart) : defaultChart);
    useEffect(() => {
        if (props.chart && chartExists(props.chart))
            setChart(getChart(props.chart));
    }, [props.chart]);

    const onNameChange = event => {
        setChart({
            ...chart,
            name: event.target.value
        });
        refresh(event.target.value);
    };

    const onTitleChange = event => {
        setChart({
            ...chart,
            title: event.target.value
        });
    };

    const onTypeChange = event => {
        setChart({
            ...chart,
            type: event.target.value
        });
    };

    const onSave = () => {
        addChart(chart);
        refresh(chart.name);
        setChart({
            ...chart,
            name: chart.name
        }); // force render to update save button
    };

    const onDelete = () => {
        deleteChart(chart);
        setChart(defaultChart);
        refresh();
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
                        {chart.type === 'timeseries' && <TimeseriesProperties chart={chart} setChart={setChart}/>}
                    </div>
                    <div className='customChartSaveArea'>
                        {chart.name.length > 0 && 
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
                        {chart.type === 'timeseries' && <TimeSeriesCreator data={data} chart={chart} setChart={setChart}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomChartBuilder;
