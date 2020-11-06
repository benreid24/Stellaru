import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from 'Monitor/Charts/Chart';
import ScatterChart from 'Monitor/Charts/ScatterChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {findKeysOverSeries, findNested, selectNested} from 'Monitor/Charts/Util';
import {capitalize} from 'Helpers';
import {translate} from 'Translator';

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

function ColonyScatter(props) {
    const name = props.name ? props.name : 'ColonyScatter';
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
    const items = planetKeys.map(key => {
        return {
            label: findNested(`planets/list/${key}/name`, data, `Planet ${key}`),
            xSelector: snap => selectNested(`planets/list/${key}/free_amenities`, snap),
            ySelector: snap => selectNested(`planets/list/${key}/stability`, snap),
            radiusSelector: snap => selectNested(`planets/list/${key}/population`, snap)
        };
    });

    const stats = ['size', 'population', 'districts', 'armies', 'stability', 'amenities', 'free_amenities', 'amenities_usage', 'free_housing', 'total_housing'];
    const renderedMenuItems = stats.map(stat => <MenuItem key={stat} value={stat}>{translate(capitalize(stat, '_'))}</MenuItem>);

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Colony Scatter')} titleColor='#96d636'>
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
                <ScatterChart
                    name={name}
                    data={data}
                    items={items}
                    xLabel='Amenities'
                    yLabel='Stability'
                    radiusLabel='Population'
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Customizable scatter chart showing user defined colony stats against one another',
    ColonyScatter
);

export default ColonyScatter;
