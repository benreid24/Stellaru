import React from 'react';
import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {GROUP_REDUCER, useLeaderboardContext} from '../Context';
import {getTimeseries, sumReducer} from '../Selectors';
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

enum VICTORY_PARTS {
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

export const VictoryChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState, groupReducer} = useLeaderboardContext();

    const [parts, setParts] = React.useState<VICTORY_PARTS[]>(recordValues(VICTORY_PARTS));
    const onPartsChange = (event: React.ChangeEvent<{value: unknown}>) => {
        console.log(event.target.value)
        setParts(event.target.value as VICTORY_PARTS[])
    };

    const selector = (snap: any, eid: number) => {
        const obj = selectNested(`leaderboard/empire_summaries/${eid}/victory_points`, snap);
        const sum = parts.length > 0
            ? parts.map((part) => obj[part]).reduce(sumReducer)
            : recordValues(VICTORY_PARTS).map((part) => obj[part]).reduce(sumReducer)
        return sum
    };
    const series = getTimeseries(data, groupState, filterState, selector, GROUP_REDUCER[groupReducer]);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select
                        multiple
                        value={parts}
                        onChange={onPartsChange}
                        renderValue={(_selected) => {
                            const selected = (_selected as string[])
                            return selected.length === recordValues(VICTORY_PARTS).length
                                ? "Total Victory Points"
                                : `Custom (${selected.length}/${recordValues(VICTORY_PARTS).length})`
                        }}
                    >
                        {recordValues(VICTORY_PARTS).map((part) => (
                            <MenuItem dense key={part} value={part}>
                                <Checkbox size='small' checked={parts.includes(part)} />
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
                    yAxisLabel='Victory Points'
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
