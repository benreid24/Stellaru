import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested, capitalize, findKeysOverSeries} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from '../../../Translator';

import './Construction.css';

const Name = 'Construction Breakdowns';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Construction(props) {
    const classes = useStyles();
    const name = props.name ? props.name : 'constructionqueuestats';
    const data = props.data;

    const [queueType, setQueueType] = useState('');
    const queueTypes = findKeysOverSeries(data, 'construction/breakdown');
    const onQueueTypeChange = event => {
        setQueueType(event.target.value);
    };
    const renderQueueType = type => <MenuItem key={type} value={type}>{translate(capitalize(type, '_'))}</MenuItem>;
    const renderedQueueTypes = queueTypes.map(renderQueueType);

    useEffect(() => {
        const saved = window.localStorage.getItem(`${name}-qtype`);
        if (saved !== null) {
            setQueueType(JSON.parse(saved));
        }
        else {
            setQueueType('shipyard');
        }
    }, [name]);
    useEffect(() => {
        window.localStorage.setItem(`${name}-qtype`, JSON.stringify(queueType));
    }, [name, queueType]);

    const renderLines = queueType => [
        {
            label: translate('Total Construction Queues'),
            selector: snap => selectNested(`construction/breakdown/${queueType}/queue_count`, snap)
        },
        {
            label: translate('Total Queued Items'),
            selector: snap => selectNested(`construction/breakdown/${queueType}/queued_items`, snap)
        },
        {
            label: translate('Average Queue Size'),
            selector: snap => selectNested(`construction/breakdown/${queueType}/avg_queue_size`, snap),
            yAxis: 'right'
        },
        {
            label: translate('Max Queue Size'),
            selector: snap => selectNested(`construction/breakdown/${queueType}/max_queue_size`, snap)
        }
    ];
    let lines = [];
    if (queueType !== '')
        lines = renderLines(queueType);

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Construction Queue Breakdowns')} titleColor='#e68e00'>
            <div className='constructionChartForm'>
                <div className='constructionChartFormInner'>
                    <FormControl className={classes.formControl}>
                        <Select value={queueType} onChange={onQueueTypeChange}>
                            {renderedQueueTypes}
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
                    yAxisLabel={translate('Count')}
                    rightYLabel={translate('Average')}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Gives lower level view into construction queues and items by queue type over time',
    Construction
);

export default Construction;
