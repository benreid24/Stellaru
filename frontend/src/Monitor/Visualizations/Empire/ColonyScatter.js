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

import './Empire.css';

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

    const [xstat, setXStat] = useState('free_amenities');
    const [ystat, setYStat] = useState('stability');
    const [zstat, setZStat] = useState('population');
    useEffect(() => {
        let saved = window.localStorage.getItem(`${name}-xstat`);
        if (saved !== null) {
            setXStat(JSON.parse(saved));
        }
        saved = window.localStorage.getItem(`${name}-ystat`);
        if (saved !== null) {
            setYStat(JSON.parse(saved));
        }
        saved = window.localStorage.getItem(`${name}-zstat`);
        if (saved !== null) {
            setZStat(JSON.parse(saved));
        }
    }, [name]);
    const onXStatChange = event => {
        window.localStorage.setItem(`${name}-xstat`, JSON.stringify(event.target.value));
        setXStat(event.target.value);
    };
    const onYStatChange = event => {
        window.localStorage.setItem(`${name}-ystat`, JSON.stringify(event.target.value));
        setYStat(event.target.value);
    };
    const onZStatChange = event => {
        window.localStorage.setItem(`${name}-zstat`, JSON.stringify(event.target.value));
        setZStat(event.target.value);
    };

    const planetKeys = findKeysOverSeries(data, 'planets/list');
    const items = planetKeys.map(key => {
        return {
            label: findNested(`planets/list/${key}/name`, data, `Planet ${key}`),
            xSelector: snap => selectNested(`planets/list/${key}/${xstat}`, snap),
            ySelector: snap => selectNested(`planets/list/${key}/${ystat}`, snap),
            radiusSelector: snap => selectNested(`planets/list/${key}/${zstat}`, snap)
        };
    });

    const stats = ['age', 'size', 'population', 'districts', 'armies', 'stability', 'amenities', 'free_amenities', 'amenities_usage', 'free_housing', 'total_housing'];
    const renderedMenuItems = stats.map(stat => <MenuItem key={stat} value={stat}>{translate(capitalize(stat, '_'))}</MenuItem>);
    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Colony Scatter')} titleColor='#96d636'>
            <div className='empireChartForm'>
                <div className='empireChartFormInner'>
                    <div className='empireChartInput'>
                        <p className='empireChartLabel'>X-Axis</p>
                        <FormControl className={classes.formControl}>
                            <Select value={xstat} onChange={onXStatChange}>
                                {renderedMenuItems}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='empireChartInput'>
                        <p className='empireChartLabel'>Y-Axis</p>
                        <FormControl className={classes.formControl}>
                            <Select value={ystat} onChange={onYStatChange}>
                                {renderedMenuItems}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='empireChartRightInput'>
                        <p className='empireChartLabel'>Radius</p>
                        <FormControl className={classes.formControl}>
                            <Select value={zstat} onChange={onZStatChange}>
                                {renderedMenuItems}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className='empireChart'>
                <ScatterChart
                    name={name}
                    data={data}
                    items={items}
                    xLabel={translate(capitalize(xstat, '_'))}
                    yLabel={translate(capitalize(ystat, '_'))}
                    radiusLabel={translate(capitalize(zstat, '_'))}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Customizable scatter chart showing user defined colony stats against one another',
    ColonyScatter,
    'Empire'
);

export default ColonyScatter;
