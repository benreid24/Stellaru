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


const Name = 'GDP (Total Empire Output)';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

enum GDP_PART {
    ResourcesBasic = "Basic Resources (x1)",
    ResourcesAdvanced = "Advanced Resources (x2-4)",
    ResourcesStrategic = "Strategic Resources (x10-20)",
    Research = "Research (x1)",
    Unity = "Unity (x3)",
    // NavalCap = "NavalCap",
    // AdminCap = "AdminCap",
    // PopGrowth = "PopGrowth",
}

const GDP_SOURCE = {
    [GDP_PART.ResourcesBasic]: [
        'gdp/base/net/energy',
        'gdp/base/net/minerals',
        'gdp/base/net/food',
    ],
    [GDP_PART.ResourcesAdvanced]: [
        'gdp/base/net/alloys',
        'gdp/base/net/consumer_goods',
    ],
    [GDP_PART.ResourcesStrategic]: [
        'gdp/base/net/volatile_motes',
        'gdp/base/net/exotic_gases',
        'gdp/base/net/rare_crystals',
        'gdp/base/net/sr_living_metal',
        'gdp/base/net/sr_zro',
        'gdp/base/net/sr_dark_matter',
    ],
    [GDP_PART.Research]: ['tech/output/total'],
    [GDP_PART.Unity]: ['unity/unity'],
    // [GDP_PART.NavalCap]: '',  // TODO: data from BE
    // [GDP_PART.AdminCap]: '',  // TODO: data from BE
    // [GDP_PART.PopGrowth]: '',  // TODO: data from BE
}

const GDP_WEIGHT = {
    [GDP_PART.ResourcesBasic]: 1,  // Already weighted from BE.
    [GDP_PART.ResourcesAdvanced]: 1,  // Already weighted from BE.
    [GDP_PART.ResourcesStrategic]: 1,  // Already weighted from BE.
    [GDP_PART.Research]: 1,
    [GDP_PART.Unity]: 3,
    // [GDP_PART.NavalCap]: 1,
    // [GDP_PART.AdminCap]: 1,
    // [GDP_PART.PopGrowth]: 42,
}

export const GDPChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
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
        return (parts.length > 0 ? parts : recordValues(GDP_PART))
            .map((part) => GDP_WEIGHT[part] * GDP_SOURCE[part].map((source) => selectNested(`leaderboard/empire_summaries/${eid}/${source}`, snap)).reduce(sumReducer))
            .reduce(sumReducer)
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
                            return (selected.length === 0 || selected.length === recordValues(GDP_PART).length)
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
                    yAxisLabel='Net GDP (base)'
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare GDP of each empire or federation',
    GDPChart,
    'Leaderboard'
)
