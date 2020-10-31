import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, findNested, selectNested, valueTickFormat} from '../Util';
import {translate} from '../../../Translator';

const Name = 'Galactic Comparisons';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Comparisons(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'comparisons';
    const data = props.data;

    const keys = ['economy', 'tech', 'victory_points', 'military'];
    const keyLabels = {
        economy: 'Economy',
        tech: 'Technology',
        victory_points: 'Victory Points',
        military: 'Fleet Strength'
    };
    const axisLabels = {
        economy: translate('Nominal GDP'),
        tech: translate('Total Research'),
        victory_points: translate('Victory Points'),
        military: translate('Relative Fleet Strength')
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
            setKey('economy')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const names = findNested('comparisons/names', data, null);
    const me = Object.keys(names)[0];
    const subkeys = findKeysOverSeries(data, `comparisons/${key}`);
    const lines = subkeys.map(eid => {
        if (!names[eid])
            return null;
        return {
            label: eid === me ? translate('You') : names[eid],
            selector: snap => selectNested(`comparisons/${key}/${eid}`, snap)
        };
    }).filter(e => e !== null);

    const scale = key === 'military' ? 'sqrt' : 'linear';
    const formatter = key === 'military' ? value => `${valueTickFormat(value)}%` : valueTickFormat;
    const renderedOptions = keys.map(k => <MenuItem key={k} value={k}>{translate(keyLabels[k])}</MenuItem>);
    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Galactic Comparisons')} titleColor='#96d636'>
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
                    yAxisLabel={axisLabels[key]}
                    lines={lines}
                    formatter={formatter}
                    leftScale={scale}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Shows comparisons between your empire and others over time',
    Comparisons
);

export default Comparisons;
