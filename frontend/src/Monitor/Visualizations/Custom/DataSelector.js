import React from 'react';

import {getNextDataLevel} from './CustomChartRepository';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function DataSelector(props) {
    const classes = useStyles();

    const dataFormat = props.dataFormat;
    const series = props.series;
    const setSeries = props.setSeries;

    const onAxisChange = event => {
        setSeries({
            ...series,
            axis: event.target.value
        });
    };

    const onLabelChange = event => {
        setSeries({
            ...series,
            label: event.target.value
        });
    };

    const onDataChange = (index, newValue) => {
        if (newValue === '*wildcard*') newValue = null;
        setSeries({
            ...series,
            data: [...series.data.slice(0, index), newValue]
        });
    };
    const wildcardAvailable = !series.data.includes(null);

    let dropdownData = dataFormat;
    const renderDropdown = (key, index) => {
        if (dropdownData === null) return null;

        let itemList = dropdownData.map(obj => <MenuItem key={obj.key} value={obj.key}>{obj.key}</MenuItem>);
        if (wildcardAvailable || key === null) {
            itemList = [
                <MenuItem key={`wildcard${index}`} value='*wildcard*'>*</MenuItem>,
                ...itemList
            ];
        }

        const obj = getNextDataLevel(dropdownData, key);
        if (obj !== null)
            dropdownData = obj.value;
        else
            dropdownData = null;
        const value = key === null ? '*wildcard*' : key;
        return (
            <div key={`${key}`} className='seriesSelectorLevel'>
                {index > 0 && <p className='seriesDataArrow'>-&gt;</p>}
                <Select value={value} onChange={event => onDataChange(index, event.target.value)}>
                    {itemList}
                </Select>
            </div>
        );
    };
    let dropdowns = series.data.map(renderDropdown);
    dropdowns.push(renderDropdown('', series.data.length));

    const axisOptions = series.axis === 'x' ?
        [<MenuItem value='x'>x</MenuItem>] :
        [<MenuItem value='left'>y (left)</MenuItem>, <MenuItem value='right'>y (right)</MenuItem>];

    return (
        <div className='dataSelector'>
            <div className='dataSelectorInputGroup'>
                <p className='dataSelectorText'>Axis:</p>
                <Select onChange={onAxisChange} value={series.axis}>
                    {axisOptions}
                </Select>
            </div>
            { series.axis !== 'x' && 
                <div className='dataSelectorInputGroup'>
                    <TextField disabled={!wildcardAvailable} label='Label' value={wildcardAvailable ? series.label : '*wildcard*'} onChange={onLabelChange}/>
                </div>
            }
            <p className='dataSelectorText'>Data:</p>
            {dropdowns}
        </div>
    );
}

export default DataSelector;
