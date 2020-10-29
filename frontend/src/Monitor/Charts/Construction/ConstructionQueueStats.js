import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested, findKeysOverSeries, capitalize} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from '../../../Translator';

const Name = 'Construction Queue Comparisons';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function ConstructionQueues(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'constructionqueuecomps';
    const data = props.data;

    const statTypes = ['queue_count', 'queued_items', 'avg_queue_size', 'max_queue_size'];
    const [stat, setStat] = useState('queue_count');
    const onStatChange = event => {
        setStat(event.target.value);
    };
    useEffect(() => {
        const saved = window.localStorage.getItem(`${name}-queueitem`);
        if (saved !== null) {
            setStat(JSON.parse(saved));
        }
    }, [name]);
    useEffect(() => {
        window.localStorage.setItem(`${name}-queueitem`, JSON.stringify(stat));
    }, [stat, name]);

    const keys = findKeysOverSeries(data, 'construction/breakdown');
    const lines = keys.map(key => {
        return {
            label: `${translate(capitalize(key, '_'))} ${translate(capitalize(stat, '_'))}`,
            selector: snap => selectNested(`construction/breakdown/${key}/${stat}`, snap)
        }
    });

    const renderStat = stat => <MenuItem key={stat} value={stat}>{capitalize(stat, '_')}</MenuItem>;
    const renderedStats = statTypes.map(renderStat);

    return (
        <Chart name={Name} overlay={props.overlay} title='Construction Queue Comparisons' titleColor='#e68e00'>
            <div className='constructionChartForm'>
                <div className='constructionChartFormInner'>
                    <FormControl className={classes.formControl}>
                        <Select value={stat} onChange={onStatChange}>
                            {renderedStats}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className='constructionChartArea'>
                <LineChart
                    name={name}
                    data={data}
                    allowIsolation={true}
                    lines={lines}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Shows construction queue comparisons by type over time',
    ConstructionQueues
);

export default ConstructionQueues;
