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

const Name = 'Resources';

const useStyles = makeStyles((theme) => ({
    formControl: {
        fontSize: 12,
        margin: theme.spacing(1),
        maxWidth: '25%',
    },
}));

enum VARIANT {
    Net = 'net',
    Inflows = 'inflows',
    Outflows = 'outflows',
    Stockpile = 'stockpile_values',
}

enum RESOURCE_PART {
    Energy = "Energy",
    Minerals = "Minerals",
    Food = "Food",
    ConsumerGoods = "Consumer Goods (x2)",
    Alloys = "Alloys (x4)",
    VolatileMotes = "Volatile Motes (x10)",
    ExoticGases = "Exotic Gases (x10)",
    RareCrystals = "Rare Crystals (x10)",
    LivingMetal = "LivingMetal (x20)",
    Zro = "Zro (x20)",
    DarkMatter = "DarkMatter (x20)",
    Nanites = "Nanites (x20)",
}


const VARIANT_LABEL: Record<VARIANT, string> = {
    [VARIANT.Net]: 'Net',
    [VARIANT.Inflows]: 'Inflow',
    [VARIANT.Outflows]: 'Outflow',
    [VARIANT.Stockpile]: 'Stockpiled',
}
const getLabel = (variant: VARIANT, parts: RESOURCE_PART[]) => {
    if(parts.length === 0 || parts.length === recordValues(RESOURCE_PART).length) {
        return `${VARIANT_LABEL[variant]} Value of All Resources`
    }

    if(parts.length === 3
        && parts.includes(RESOURCE_PART.Energy)
        && parts.includes(RESOURCE_PART.Minerals)
        && parts.includes(RESOURCE_PART.Food)
    ) {
        return `${VARIANT_LABEL[variant]} Value of Basic Resources`
    }

    if(parts.length === 2
        && parts.includes(RESOURCE_PART.Alloys)
        && parts.includes(RESOURCE_PART.ConsumerGoods)
    ) {
        return `${VARIANT_LABEL[variant]} Value of Advanced Resources`
    }

    if(parts.length === 5
        && parts.includes(RESOURCE_PART.Energy)
        && parts.includes(RESOURCE_PART.Minerals)
        && parts.includes(RESOURCE_PART.Food)
        && parts.includes(RESOURCE_PART.Alloys)
        && parts.includes(RESOURCE_PART.ConsumerGoods)
    ) {
        return `${VARIANT_LABEL[variant]} Value of Basic+Adv. Resources`
    }

    if(parts.length === 7
        && parts.includes(RESOURCE_PART.VolatileMotes)
        && parts.includes(RESOURCE_PART.ExoticGases)
        && parts.includes(RESOURCE_PART.RareCrystals)
        && parts.includes(RESOURCE_PART.LivingMetal)
        && parts.includes(RESOURCE_PART.Zro)
        && parts.includes(RESOURCE_PART.DarkMatter)
        && parts.includes(RESOURCE_PART.Nanites)
    ) {
        return `${VARIANT_LABEL[variant]} Value of Strategic Resources`
    }

    if(parts.length === 1) {
        return `${VARIANT_LABEL[variant]} Value of ${parts[0].replace(/\(.*\)/, '').trim()}`
    }

    return `${VARIANT_LABEL[variant]} Value of ${parts.length}/${recordValues(RESOURCE_PART).length} Resources`
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
    [RESOURCE_PART.Nanites]: 'nanites',
}

export const ResourceValueChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState} = useLeaderboardContext();

    const [mode, setMode] = React.useState<'sum' | 'avg'>('avg');
    const onModeChange = (event: React.ChangeEvent<{value: unknown}>) => setMode(event.target.value as 'sum' | 'avg');

    const [variant, setVariant] = React.useState<VARIANT>(VARIANT.Net);
    const onVariantChange = (event: React.ChangeEvent<{value: unknown}>) => setVariant(event.target.value as VARIANT);

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
                        <MenuItem dense value='avg'>Average</MenuItem>
                        <MenuItem dense value='sum'>Total</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select value={variant} onChange={onVariantChange}>
                        <MenuItem dense value='net'>Net</MenuItem>
                        <MenuItem dense value='inflows'>Inflows</MenuItem>
                        <MenuItem dense value='outflows'>Outflows</MenuItem>
                        <MenuItem dense value='stockpile_values'>Stockpile</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select
                        multiple
                        value={parts}
                        onChange={onPartsChange}
                        renderValue={(_selected) => {
                            const selected = (_selected as string[])
                            return (selected.length === 0 || selected.length === recordValues(RESOURCE_PART).length)
                                ? "All Resources"
                                : `${selected.length}/${recordValues(RESOURCE_PART).length}`
                        }}
                    >
                        {recordValues(RESOURCE_PART).map((part) => (
                            <MenuItem dense key={part} value={part}>
                                <Checkbox size='small' style={{padding: 4}} checked={parts.includes(part)} />
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
                    yAxisLabel={getLabel(variant, parts)}
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
