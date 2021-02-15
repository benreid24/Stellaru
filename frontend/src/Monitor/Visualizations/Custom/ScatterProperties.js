import React from 'react';

import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '45%',
    }
}));

function ScatterProperties(props) {
    const classes = useStyles();

    const chart = props.chart;
    const setChart = props.setChart;

    const onChange = (key, value) => {
        setChart({
            ...chart,
            scatter: {
                ...chart.scatter,
                [key]: value
            }
        });
    };

    return (
        <div className='customPropsArea'>
            <div className='customPropsInputGroup'>
                <TextField label="X-Axis Label" value={chart.scatter.xAxisLabel} onChange={event => onChange('xAxisLabel', event.target.value)} className={classes.textField}/>
                <TextField label="Y-Axis Label" value={chart.scatter.yAxisLabel} onChange={event => onChange('yAxisLabel', event.target.value)} className={classes.textField}/>
            </div>
        </div>
    )
}

export default ScatterProperties;
