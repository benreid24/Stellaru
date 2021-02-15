import React from 'react';

import {getNextDataLevel} from './CustomChartRepository';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function DataSelector(props) {
    const dataFormat = props.dataFormat;
    const series = props.series;
    const data = props.data;
    const setData = props.setData;
    const setSeries = props.setSeries;
    const onDelete = props.onDelete;
    const axisTypes = props.axisTypes;
    const canBeArea = props.timeseries;
    const hasLabel = props.label;
    const wildcardAllowed = props.wildcard;

    if (!data) { // handle data format changes on saved charts
        setTimeout(() => setData([]), 50);
        return <div></div>;
    }

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

    const onTypeChange = event => {
        setSeries({
            ...series,
            type: event.target.value
        });
    };

    const onStackChange = event => {
        setSeries({
            ...series,
            stackId: event.target.value
        });
    };

    const onDataChange = (index, newValue) => {
        if (newValue === '*wildcard*') newValue = null;
        setData([...data.slice(0, index), newValue]);
    };
    const wildcardAvailable = !data.includes(null);

    let dropdownData = dataFormat;
    const renderDropdown = (key, index) => {
        if (dropdownData === null) return null;

        let itemList = dropdownData.map(obj => <MenuItem key={obj.key} value={obj.key}>{obj.key}</MenuItem>);
        if ((wildcardAvailable || key === null) && wildcardAllowed) {
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
    let dropdowns = data.map(renderDropdown);
    dropdowns.push(renderDropdown('', data.length));

    const axisOptions = axisTypes.map(axis => <MenuItem key={axis.value} value={axis.value}>{axis.name}</MenuItem>);

    return (
        <div className='dataSelector'>
            {axisOptions.length > 0 &&
                <div className='dataSelectorInputGroup'>
                    <p className='dataSelectorText'>Axis:</p>
                    <Select onChange={onAxisChange} value={axisTypes.length === 1 ? axisTypes[0].value : (series ? series.axis : 'x')}>
                        {axisOptions}
                    </Select>
                </div>
            }
            {hasLabel && 
                <div className='dataSelectorInputGroup'>
                    <TextField disabled={!wildcardAvailable} label='Label' value={wildcardAvailable ? series.label : '*wildcard*'} onChange={onLabelChange}/>
                </div>
            }
            <p className='dataSelectorText'>Data:</p>
            {dropdowns}
            {canBeArea &&
                <p className='dataSelectorText'>Type</p>
            }
            {canBeArea &&
                <Select onChange={onTypeChange} value={series.type}>
                    <MenuItem value='line'>Line</MenuItem>
                    <MenuItem value='area'>Area</MenuItem>
                </Select>
            }
            {canBeArea && series.type === 'area' &&
                <p className='dataSelectorText'>Stack</p>
            }
            {canBeArea && series.type === 'area' &&
                <Select value={series.stackId} onChange={onStackChange}>
                    <MenuItem value='none'>None</MenuItem>
                    <MenuItem value='stack1'>Group 1</MenuItem>
                    <MenuItem value='stack2'>Group 2</MenuItem>
                    <MenuItem value='stack3'>Group 3</MenuItem>
                    <MenuItem value='stack4'>Group 4</MenuItem>
                    <MenuItem value='stack5'>Group 5</MenuItem>
                </Select>
            }
            {onDelete && 
                <div className='dataSelectorDeleteButtonArea'>
                    <Button variant='contained' color='secondary' onClick={onDelete}>Delete</Button>
                </div>
            }
        </div>
    );
}

export default DataSelector;
