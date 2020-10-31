import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {selectNested} from '../Util';
import {translate} from '../../../Translator';

const Name = 'Total Economy Value';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Gdp(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'total_economy_value';
    const data = props.data;

    const keys = ['total_inflows', 'total_outflows', 'total_net', 'total_stockpile_value'];
    const keyLabels = {
        total_inflows: 'Gross Income',
        total_outflows: 'Spending',
        total_net: 'Net Income',
        total_stockpile_value: 'Stockpile'
    };

    const [key, setKey] = useState('');
    const onKeyChange = event => {
        const newKey = event.target.value;
        setKey(newKey);
        window.localStorage.setItem(`${name}-type`, JSON.stringify(newKey));
    };
    useEffect(() => {
        const stored = window.localStorage.getItem(`${name}-type`);
        if (stored !== null && key === '' ) {
            setKey(JSON.parse(stored));
        }
        else {
            setKey('total_inflows')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const lines = [
        {
            label: translate('Nominal Total Value'),
            selector: snap => selectNested(`economy/base_gdp/${key}`, snap)
        },
        {
            label: translate('Market Adjusted Total Value'),
            selector: snap => selectNested(`economy/adjusted_gdp/${key}`, snap)
        }
    ];

    const renderedOptions = keys.map(key => <MenuItem key={key} value={key}>{translate(keyLabels[key])}</MenuItem>);
    return (
        <Chart name={Name} overlay={props.overlay} title={translate(`Total Value (${keyLabels[key]})`)} titleColor='#ded140'>
            <div className='gdpForm'>
                <FormControl className={classes.formControl}>
                    <Select value={key} onChange={onKeyChange}>
                        {renderedOptions}
                    </Select>
                </FormControl>
            </div>
            <div className='gdpChart'>
                <LineChart
                    name={name}
                    data={data}
                    yAxisLabel={translate('Energy Credits')}
                    lines={lines}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Shows nominal and market value adjusted total market value over time',
    Gdp
);

export default Gdp;
