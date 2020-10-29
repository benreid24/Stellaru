import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, capitalize, findNested, selectNested} from '../Util';
import {translate} from '../../../Translator';

const Name = 'Colony Stats';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Colonies(props) {
    const name = props.name ? props.name : 'Colonies';
    const classes = useStyles();
    const data = props.data;

    const [stat, setStat] = useState('population');
    useEffect(() => {
        const saved = window.localStorage.getItem(`${name}-stat`);
        if (saved !== null) {
            setStat(JSON.parse(saved));
        }
    }, [name]);
    const onStatChange = event => {
        window.localStorage.setItem(`${name}-stat`, JSON.stringify(event.target.value));
        setStat(event.target.value);
    }

    const planetKeys = findKeysOverSeries(data, 'planets/list');
    const lines = planetKeys.map(key => {
        return {
            label: findNested(`planets/list/${key}/name`, data, `Planet ${key}`),
            selector: snap => selectNested(`planets/list/${key}/${stat}`, snap)
        };
    });

    const stats = ['size', 'population', 'districts', 'armies', 'stability', 'amenities', 'free_amenities', 'amenities_usage', 'free_housing', 'total_housing'];
    const renderedMenuItems = stats.map(stat => <MenuItem key={stat} value={stat}>{translate(capitalize(stat, '_'))}</MenuItem>);

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Colony') + ' ' +  capitalize(stat, '_')} titleColor='#96d636'>
            <div className='fancyChartForm'>
                <div className='fancyChartInner'>
                    <FormControl className={classes.formControl}>
                        <Select value={stat} onChange={onStatChange}>
                            {renderedMenuItems}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className='fancyBreakdownChart'>
                <LineChart
                    name={name}
                    data={data}
                    lines={lines}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Shows various statistics per colony over time',
    Colonies
);

export default Colonies;
