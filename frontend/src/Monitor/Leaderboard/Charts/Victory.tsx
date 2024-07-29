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


const Name = 'Victory';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 240,
    },
}));

enum VICTORY_PART {
    "Colonies" = "Colonies",
    "Crisis Ships Killed" = "Crisis Ships Killed",
    "Economy" = "Economy",
    "Federation" = "Federation",
    "Pops" = "Pops",
    "Relics" = "Relics",
    "Subjects" = "Subjects",
    "Systems" = "Systems",
    "Technology" = "Technology",
}
const getLabel = (parts: VICTORY_PART[]) => {
    if(parts.length === 0 || parts.length === recordValues(VICTORY_PART).length) {
        return `Victory Points`
    }

    if(parts.length === 1
        && parts.includes(VICTORY_PART['Crisis Ships Killed'])
    ) {
        return `Crisis Victory Points`
    }

    if(parts.length === 1) return `${parts[0]} Victory Points`

    return `${parts.length}/${recordValues(VICTORY_PART).length} Victory Points`
}

export const VictoryChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState} = useLeaderboardContext();

    const [mode, setMode] = React.useState<'sum' | 'avg'>('avg');
    const onModeChange = (event: React.ChangeEvent<{value: unknown}>) => setMode(event.target.value as 'sum' | 'avg');

    const [parts, setParts] = React.useState<VICTORY_PART[]>(recordValues(VICTORY_PART));
    const onPartsChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setParts(event.target.value as VICTORY_PART[])
    };

    const reducer = mode === 'sum' ? sumReducer : avgReducer;
    const selector = (snap: any, eid: number) => {
        const obj = selectNested(`leaderboard/empire_summaries/${eid}/victory_points`, snap);
        return (parts.length > 0 ? parts : recordValues(VICTORY_PART))
            .map((part) => obj[part])
            .reduce(sumReducer)
    };
    const series = getTimeseries(data, groupState, filterState, selector, reducer);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={mode} onChange={onModeChange}>
                        <MenuItem value='avg'>Average Victory Points</MenuItem>
                        <MenuItem value='sum'>Total Victory Points</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select
                        multiple
                        value={parts}
                        onChange={onPartsChange}
                        renderValue={(_selected) => {
                            const selected = (_selected as string[])
                            return (selected.length === 0 || selected.length === recordValues(VICTORY_PART).length)
                                ? "All sources"
                                : `Custom (${selected.length}/${recordValues(VICTORY_PART).length})`
                        }}
                    >
                        {recordValues(VICTORY_PART).map((part) => (
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
                    yAxisLabel={getLabel(parts)}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare Victory Points of each empire or federation',
    VictoryChart,
    'Leaderboard'
)
