import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from 'Monitor/Charts/Chart';
import AreaChart from 'Monitor/Charts/AreaChart';
import {selectNested, findKeysOverSeries} from 'Monitor/Charts/Util';
import {capitalize} from 'Helpers';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Pops';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Pops(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'pops';
    const data = props.data;
    const stats = ['species', 'categories', 'ethics'];

    const [stat, setStat] = useState('');
    const onStatChange = event => {
        const newStat = event.target.value;
        setStat(newStat);
        window.localStorage.setItem(`${name}-stat`, JSON.stringify(newStat));
    };
    useEffect(() => {
        const stored = window.localStorage.getItem(`${name}-stat`);
        if (stored !== null && stat === '') {
            setStat(JSON.parse(stored));
        }
        else {
            setStat('species');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const keys = findKeysOverSeries(data, `pops/${stat}`);
    const areas = keys.map(key => {
        return {
            label: translate(capitalize(key, '_')),
            selector: snap => selectNested(`pops/${stat}/${key}`, snap)
        };
    });

    const renderedStats = stats.map(option => <MenuItem key={option} value={option}>{translate(capitalize(option))}</MenuItem>);
    return (
        <Chart name={Name} overlay={props.overlay} title={translate(`Pop ${capitalize(stat)} Breakdown`)} titleColor='#65c73c'>
            <div className='societyChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={stat} onChange={onStatChange}>
                        {renderedStats}
                    </Select>
                </FormControl>
            </div>
            <div className='societyChartArea'>
                <AreaChart
                    name={name}
                    data={data}
                    allowIsolation={true}
                    stack={true}
                    areas={areas}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Shows pop metrics over time, such as species, category, and ethics',
    Pops
);

export default Pops;
