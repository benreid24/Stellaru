import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {selectNested, findKeysOverSeries} from '../Util';
import {translate} from '../../../Translator';
import { getResourceName } from './Util';

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

function ResourceValues(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'resource_values';
    const data = props.data;

    const keys = ['inflows', 'outflows', 'net'];
    const keyLabels = {
        inflows: 'Gross Income',
        outflows: 'Spending',
        net: 'Net Income'
    };

    const [key, setKey] = useState('');
    const onKeyChange = event => {
        const newKey = event.target.value;
        setKey(newKey);
        window.localStorage.setItem(`${name}-flow`, JSON.stringify(newKey));
    };
    useEffect(() => {
        const stored = window.localStorage.getItem(`${name}-flow`);
        if (stored !== null && key === '' ) {
            setKey(JSON.parse(stored));
        }
        else {
            setKey('inflows')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const types = ['base_gdp', 'adjusted_gdp'];
    const typeLabels = {
        base_gdp: 'Nominal Value',
        adjusted_gdp: 'Market Value'
    };

    const [type, setType] = useState('');
    const onTypeChange = event => {
        const newType = event.target.value;
        setType(newType);
        window.localStorage.setItem(`${name}-type`, JSON.stringify(newType));
    };
    useEffect(() => {
        const stored = window.localStorage.getItem(`${name}-type`);
        if (stored !== null && key === '' ) {
            setType(JSON.parse(stored));
        }
        else {
            setType('base_gdp')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resourceKeys = findKeysOverSeries(data, `economy/base_gdp/${key}`);
    const lines = resourceKeys.reduce((lines, rkey) => {
        return [
            ...lines,
            {
                label: translate(`${getResourceName(rkey)} ${translate(typeLabels[type])}`),
                selector: snap => selectNested(`economy/${type}/${key}/${rkey}`, snap)
            }
        ]
    }, []);

    const renderedOptions = keys.map(key => <MenuItem key={key} value={key}>{translate(keyLabels[key])}</MenuItem>);
    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Resource Values')} titleColor='#ded140'>
            <div className='resourceValueForm'>
                <FormControl className={classes.formControl}>
                    <Select value={key} onChange={onKeyChange}>
                        {renderedOptions}
                    </Select>
                    <Select value={type} onChange={onTypeChange}>
                        <MenuItem value='base_gdp'>{translate(typeLabels['base_gdp'])}</MenuItem>
                        <MenuItem value='adjusted_gdp'>{translate(typeLabels['adjusted_gdp'])}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='resourceValueChart'>
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
    'Shows nominal and market value adjusted resource values over time',
    ResourceValues
);

export default ResourceValues;
