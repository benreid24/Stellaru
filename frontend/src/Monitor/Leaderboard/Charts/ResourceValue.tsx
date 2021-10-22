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

const Name = 'Resource Production';

const useStyles = makeStyles((theme) => ({
    formControl: {
        fontSize: 12,
        margin: theme.spacing(1),
        maxWidth: '25%',
    },
}));

enum RESOURCE_PART {
    Energy = "Energy",
    Minerals = "Minerals",
    Food = "Food",
    Alloys = "Alloys",
    ConsumerGoods = "ConsumerGoods",
    VolatileMotes = "VolatileMotes",
    ExoticGases = "ExoticGases",
    RareCrystals = "RareCrystals",
    LivingMetal = "LivingMetal",
    Zro = "Zro",
    DarkMatter = "DarkMatter",
}

const RESOURCE_SOURCE = {
    [RESOURCE_PART.Energy]: 'energy',
    [RESOURCE_PART.Minerals]: 'minerals',
    [RESOURCE_PART.Food]: 'food',
    [RESOURCE_PART.Alloys]: 'alloys',
    [RESOURCE_PART.ConsumerGoods]: 'consumer_goods',
    [RESOURCE_PART.VolatileMotes]: 'volatile_motes',
    [RESOURCE_PART.ExoticGases]: 'exotic_gases',
    [RESOURCE_PART.RareCrystals]: 'rare_crystals',
    [RESOURCE_PART.LivingMetal]: 'sr_living_metal',
    [RESOURCE_PART.Zro]: 'sr_zro',
    [RESOURCE_PART.DarkMatter]: 'sr_dark_matter',
}

export const ResourceValueChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState} = useLeaderboardContext();

    const [mode, setMode] = React.useState<'sum' | 'avg'>('avg');
    const onModeChange = (event: React.ChangeEvent<{value: unknown}>) => setMode(event.target.value as 'sum' | 'avg');

    const [variant, setVariant] = React.useState<'net' | 'inflows' | 'outflows' | 'stockpile_values'>('net');
    const onVariantChange = (event: React.ChangeEvent<{value: unknown}>) => setVariant(event.target.value as 'net' | 'inflows' | 'outflows' | 'stockpile_values');

    const [parts, setParts] = React.useState<RESOURCE_PART[]>(recordValues(RESOURCE_PART));
    const onPartsChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setParts(event.target.value as RESOURCE_PART[])
    };

    const reducer = mode === 'sum' ? sumReducer : avgReducer;
    const selector = (snap: any, eid: number) => {
        return (parts.length > 0 ? parts : recordValues(RESOURCE_PART))
            .map((part) => selectNested(`leaderboard/empire_summaries/${eid}/gdp/base/${variant}/${RESOURCE_SOURCE[part]}`, snap))
            .reduce(sumReducer)
    };
    const series = getTimeseries(data, groupState, filterState, selector, reducer);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={mode} onChange={onModeChange}>
                        <MenuItem value='avg'>Average</MenuItem>
                        <MenuItem value='sum'>Total</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select value={variant} onChange={onVariantChange}>
                        <MenuItem value='net'>Net</MenuItem>
                        <MenuItem value='inflows'>Inflows</MenuItem>
                        <MenuItem value='outflows'>Outflows</MenuItem>
                        <MenuItem value='stockpile_values'>Stockpile</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select
                        multiple
                        value={parts}
                        onChange={onPartsChange}
                        renderValue={(_selected) => {
                            const selected = (_selected as string[])
                            return selected.length === recordValues(RESOURCE_PART).length
                                ? "Total Production"
                                : `${selected.length}/${recordValues(RESOURCE_PART).length}`
                        }}
                    >
                        {recordValues(RESOURCE_PART).map((part) => (
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
                    yAxisLabel='Net Resource Production (base)'
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare Resource Production of each empire or federation',
    ResourceValueChart,
    'Leaderboard'
)
