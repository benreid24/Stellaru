import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from 'Monitor/Charts/Chart';
import AreaChart from 'Monitor/Charts/AreaChart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested, valueTickFormat} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from 'Translator';

import './Science.css';

const Name = 'Science Output';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function ScienceOutput(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'scienceoutput';
    const data = props.data;

    const [chartType, setChartType] = useState('');
    const onChartTypeChange = event => {
        setChartType(event.target.value);
        window.localStorage.setItem(`${name}-chartType`, JSON.stringify(event.target.value));
    };
    useEffect(() => {
        const stored = window.localStorage.getItem(`${name}-chartType`);
        if (stored !== null && chartType === '') {
            setChartType(JSON.parse(stored));
        }
        else {
            setChartType('area');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const series = [
        {
            label: translate('Physics Research'),
            selector: snap => selectNested('economy/net_income/physics_research', snap)
        },
        {
            label: translate('Society Research'),
            selector: snap => selectNested('economy/net_income/society_research', snap)
        },
        {
            label: translate('Engineering Research'),
            selector: snap => selectNested('economy/net_income/engineering_research', snap)
        }
    ];

    let total = 0;
    if (data.length > 0) {
        total += selectNested('economy/net_income/physics_research', data[data.length-1]);
        total += selectNested('economy/net_income/society_research', data[data.length-1]);
        total += selectNested('economy/net_income/engineering_research', data[data.length-1]);
    }
    total = valueTickFormat(total);
    const completedTechs = data.length > 0 ? selectNested('tech/completed_techs', data[data.length-1]) : 0;
    const availableTechs = data.length > 0 ?
        selectNested('tech/available_techs/engineering', data[data.length-1]) +
        selectNested('tech/available_techs/physics', data[data.length-1]) +
        selectNested('tech/available_techs/society', data[data.length-1]) : 0;

    const chart = chartType === 'area' ? 
        (
            <AreaChart
                name={name}
                data={data}
                yAxisLabel={translate('Monthly Research')}
                stack={true}
                allowIsolation={true}
                areas={series}
            />
        ) :
        (
            <LineChart
                name={name}
                data={data}
                yAxisLabel={translate('Monthly Research')}
                allowIsolation={true}
                lines={series}
            />
        );

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Science Output')} titleColor='#0b9cbd'>
            <div className='scienceChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={chartType} onChange={onChartTypeChange}>
                        <MenuItem value='area'>{translate('Stacked Area')}</MenuItem>
                        <MenuItem value='line'>{translate('Lines')}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='scienceOverviewChart'>
                {chart}
            </div>
            <div className='scienceTotalArea'>
                <div className='row'>
                    <div className='col-3 align-self-center'>
                        <h2 className='scienceTotal'>{translate('Total')}: <span className='scienceTotalNumber'>{total}</span></h2>
                    </div>
                    <div className='col-4 align-self-center'>
                        <h2 className='scienceTotal'>{translate('Completed Techs')}: <span className='scienceTotalNumber'>{completedTechs}</span></h2>
                    </div>
                    <div className='col-4 align-self-center'>
                        <h2 className='scienceTotal'>{translate('Available Techs')}: <span className='scienceTotalNumber'>{availableTechs}</span></h2>
                    </div>
                </div>
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Displays the science output over time, broken down by type. Also displays the number of researched techs and currently available techs',
    ScienceOutput
);

export default ScienceOutput;
