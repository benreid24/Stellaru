import React, {useState} from 'react';

import TimeseriesProperties from './TimeseriesProperties';
import TimeSeriesCreator from './TimeSeriesCreator';

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
    titleInput: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '90%'
    },
    button: {
        width: '20%'
    }
}));

const defaultChart = {
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
        xScale: 'linear', // log | sqrt
        leftAxisLabel: '',
        leftScale: 'linear', // log | sqrt
        rightAxisLabel: '',
        rightScale: 'linear', // log | sqrt
        x: [], //selector path
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

    // TODO - default to loaded chart if specified
    const [chart, setChart] = useState(defaultChart);

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
        console.log(`Chart saved:`);
        console.log(chart);
    };

    return (
        <div>
            <div className='row chartRow justify-content-center'>
                <div className='col-xl-6 col-md-8 col-xs-12'>
                    <div className='placeholder customChartArea'>
                        <p>Chart preview</p>
                    </div>
                </div>
            </div>
            <div className='row chartRow'>
                <div className='col-6'>
                    <div className='customChartTypeArea'>
                        <Select value={chart.type} onChange={onTypeChange}>
                            <MenuItem value='timeseries'>Time Series</MenuItem>
                            <MenuItem value='scatter'>Scatter</MenuItem>
                            <MenuItem value='pie'>Pie</MenuItem>
                        </Select>
                        <TextField label="Chart Title" onChange={onTitleChange} className={classes.titleInput}/>
                    </div>
                    <div className='customChartPropsArea'>
                        {chart.type === 'timeseries' && <TimeseriesProperties chart={chart} setChart={setChart}/>}
                    </div>
                    <div className='customChartSaveArea'>
                        <Button variant="contained" color="primary" className={classes.button} onClick={onSave}>Save</Button>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='customSeriesArea'>
                        {chart.type === 'timeseries' && <TimeSeriesCreator data={data}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomChartBuilder;
