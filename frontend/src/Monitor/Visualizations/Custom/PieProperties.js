import React from 'react'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function PieProperties(props) {
    const setChart = props.setChart;
    const chart = props.chart;

    const setLabelType = event => {
        setChart({
            ...chart,
            pie: {
                ...chart.pie,
                label: event.target.value
            }
        });
    };

    return (
        <div className='customPropsArea'>
            <div className='customPropsInputGroup'>
                <p className='customPropsText'>Chart Label Type</p>
                <Select value={chart.pie.label} onChange={setLabelType}>
                    <MenuItem value='label'>Show Section Label</MenuItem>
                    <MenuItem value='value'>Label With Value</MenuItem>
                    <MenuItem value='none'>No Labels On Chart</MenuItem>
                </Select>
            </div>
        </div>
    );
}

export default PieProperties;
