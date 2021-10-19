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

const Name = 'GDP';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export const GDPChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState} = useLeaderboardContext();

    const [mode, setMode] = React.useState<'sum' | 'avg'>('avg');
    const onModeChange = (event: React.ChangeEvent<{value: unknown}>) => setMode(event.target.value as 'sum' | 'avg');

    const reducer = mode === 'sum' ? sumReducer : avgReducer;
    const selector = (snap: any, eid: number) => {
        return selectNested(`leaderboard/empire_summaries/${eid}/gdp/base/total_net`, snap);
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
