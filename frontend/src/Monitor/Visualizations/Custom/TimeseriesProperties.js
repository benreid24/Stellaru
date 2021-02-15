import React from 'react';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '45%',
    }
}));

function TimeseriesProperties(props) {
    const classes = useStyles();

    const chart = props.chart;
    const setChart = props.setChart;

    const onChange = (key, value) => {
        setChart({
            ...chart,
            timeseries: {
                ...chart.timeseries,
                [key]: value
            }
        });
    };

    return (
        <div className='customPropsArea'>
            <div className='customPropsInputGroup'>
                <TextField label="X-Axis Label" value={chart.timeseries.xAxisLabel} onChange={event => onChange('xAxisLabel', event.target.value)} className={classes.textField}/>
            </div>
            <div className='customPropsInputGroup'>
                <TextField label="Left Y-Axis Label" value={chart.timeseries.leftAxisLabel} onChange={event => onChange('leftAxisLabel', event.target.value)} className={classes.textField}/>
                <p className='customPropsText'>Left Y-Axis Scale</p>
                <Select value={chart.timeseries.leftScale} onChange={event => onChange('leftScale', event.target.value)}>
                    <MenuItem value='linear'>Linear</MenuItem>
                    <MenuItem value='log'>Log</MenuItem>
                    <MenuItem value='sqrt'>Square Root</MenuItem>
                </Select>
            </div>
            <div className='customPropsInputGroup'>
                <TextField label="Right Y-Axis Label" value={chart.timeseries.rightAxisLabel} onChange={event => onChange('rightAxisLabel', event.target.value)} className={classes.textField}/>
                <p className='customPropsText'>Right Y-Axis Scale</p>
                <Select value={chart.timeseries.rightScale} onChange={event => onChange('rightScale', event.target.value)}>
                    <MenuItem value='linear'>Linear</MenuItem>
                    <MenuItem value='log'>Log</MenuItem>
                    <MenuItem value='sqrt'>Square Root</MenuItem>
                </Select>
            </div>
        </div>
    )
}

export default TimeseriesProperties;
