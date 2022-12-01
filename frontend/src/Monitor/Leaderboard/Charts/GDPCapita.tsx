import React from 'react';
import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {useLeaderboardContext} from '../Context';
import {getTimeseries, avgReducer, sumReducer} from '../Selectors';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {LeaderboardChartProps} from './Types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import { Checkbox, ListItemText } from '@material-ui/core';

// Like `Object.keys` but typed. TODO: move to reusable commons?
type KeyValue<T extends Record<string, unknown>, K extends keyof T = keyof T> = [K, T[K]]
export const recordEntries = <T extends Record<string, unknown>>(o: T) => Object.entries(o) as KeyValue<T>[];
export const recordKeys = <T extends Record<string, unknown>>(o: T) => Object.keys(o) as (keyof T)[];
export const recordValues = <T extends Record<string, unknown>>(o: T) => Object.values(o) as T[keyof T][];


const Name = 'GDP/Capita';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

enum GDP_PART {
    Resources = "Resources",
    Research = "Research",
    Unity = "Unity",
    // NavalCap = "NavalCap",
    // AdminCap = "AdminCap",
    // PopGrowth = "PopGrowth",
}

const GDP_SOURCE = {
    [GDP_PART.Resources]: 'gdp/base/total_net',
    [GDP_PART.Research]: 'tech/output/total',
    [GDP_PART.Unity]: 'unity/unity',
    // [GDP_PART.NavalCap]: '',  // TODO: data from BE
    // [GDP_PART.AdminCap]: '',  // TODO: data from BE
    // [GDP_PART.PopGrowth]: '',  // TODO: data from BE
}

const GDP_WEIGHT = {
    [GDP_PART.Resources]: 1,
    [GDP_PART.Research]: 1,
    [GDP_PART.Unity]: 3,
    // [GDP_PART.NavalCap]: 1,
    // [GDP_PART.AdminCap]: 1,
    // [GDP_PART.PopGrowth]: 42,
}

export const GDPCapitaChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState} = useLeaderboardContext();

    const [mode, setMode] = React.useState<'sum' | 'avg'>('avg');
    const onModeChange = (event: React.ChangeEvent<{value: unknown}>) => setMode(event.target.value as 'sum' | 'avg');

    const [parts, setParts] = React.useState<GDP_PART[]>(recordValues(GDP_PART));
    const onPartsChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setParts(event.target.value as GDP_PART[])
    };

    const reducer = mode === 'sum' ? sumReducer : avgReducer;
    const selector = (snap: any, eid: number) => {
        const gdp = (parts.length > 0 ? parts : recordValues(GDP_PART))
            .map((part) => GDP_WEIGHT[part] * selectNested(`leaderboard/empire_summaries/${eid}/${GDP_SOURCE[part]}`, snap))
            .reduce(sumReducer)
        return gdp / selectNested(`leaderboard/empire_summaries/${eid}/pop_count`, snap)
    };
    const series = getTimeseries(data, groupState, filterState, selector, reducer);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={mode} onChange={onModeChange}>
                        <MenuItem value='avg'>Average GDP</MenuItem>
                        <MenuItem value='sum'>Total GDP</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select
                        multiple
                        value={parts}
                        onChange={onPartsChange}
                        renderValue={(_selected) => {
                            const selected = (_selected as string[])
                            return selected.length === recordValues(GDP_PART).length
                                ? "Total GDP"
                                : `Custom (${selected.length}/${recordValues(GDP_PART).length})`
                        }}
                    >
                        {recordValues(GDP_PART).map((part) => (
                            <MenuItem key={part} value={part}>
                                <Checkbox checked={parts.includes(part)} />
                                <ListItemText primary={part} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className='leaderboardFormChartContent'>
                <LineChart
                    name={name}
                    data={data}
                    lines={series.map(gts => gts.timeseries)}
                    allowIsolation={false}
                    yAxisLabel='GDP/Capita'
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare GDP/Capita of each empire or federation',
    GDPCapitaChart,
    'Leaderboard'
)
