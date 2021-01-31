import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
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
    formControl: {
        width: '100%'
    },
    button: {
        width: '20%'
    }
}));

function CustomChartProperties(props) {
    const classes = useStyles();

    const chartProps = props.chartProps;
    const setChartProps = props.setChartProps;
    const onSave = props.onSave;

    const onChange = (field, newValue) => {
        setChartProps({
            ...chartProps,
            [field]: newValue
        });
    };

    return (
        <div className='customPropsArea'>
            <FormControl className={classes.formControl}>
                <div>
                    <TextField label="Chart Title" onChange={event => onChange('title', event.target.value)} className={classes.titleInput}/>
                </div>
                <div>
                    <TextField label="X-Axis Label" onChange={event => onChange('xAxisLabel', event.target.value)} className={classes.textField}/>
                    <TextField label="X-Axis Scale" onChange={event => onChange('xAxisScaleType', event.target.value)} className={classes.textField}/>
                </div>
                <div>
                    <TextField label="Left Y-Axis Label" onChange={event => onChange('leftAxisLabel', event.target.value)} className={classes.textField}/>
                    <TextField label="Left Y-Axis Scale" onChange={event => onChange('leftAxisScaleType', event.target.value)} className={classes.textField}/>
                </div>
                <div>
                    <TextField label="Right Y-Axis Label" onChange={event => onChange('rightAxisLabel', event.target.value)} className={classes.textField}/>
                    <TextField label="Right Y-Axis Scale" onChange={event => onChange('rightAxisScaleType', event.target.value)} className={classes.textField}/>
                </div>
                <div style={{paddingTop: '10px'}}>
                    <Button variant="contained" color="primary" className={classes.button} onClick={onSave}>Save</Button>
                </div>
            </FormControl>
        </div>
    )
}

export default CustomChartProperties;
