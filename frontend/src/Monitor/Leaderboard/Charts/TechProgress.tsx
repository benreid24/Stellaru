import React from 'react';
import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {useLeaderboardContext} from '../Context';
import {getTimeseries, avgReducer, maxValReducer} from '../Selectors';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {LeaderboardChartProps} from './Types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

const Name = 'Tech Progress';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export const TechProgressChart: React.FC<LeaderboardChartProps> = ({data, name: n}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState} = useLeaderboardContext();

    const [mode, setMode] = React.useState<'max' | 'avg'>('max');
    const onModeChange = (event: any) => setMode(event.target.value);

    const reducer = mode === 'max' ? maxValReducer : avgReducer;
    const selector = (snap: any, eid: number) => {
        return selectNested(`leaderboard/empire_summaries/${eid}/tech/completed_techs`, snap);
    };
    const series = getTimeseries(groupState, selector, reducer);

    return (
        <Chart name={name} title={name} titleColor='#6666cd'>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={mode} onChange={onModeChange}>
                        <MenuItem value='avg'>Average Progress</MenuItem>
                        <MenuItem value='max'>Most Advanced Member</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='leaderboardFormChartContent'>
                <LineChart
                    name={name}
                    data={data}
                    lines={series.map(gts => gts.timeseries)}
                    allowIsolation={false}
                    yAxisLabel='Technological Progress'
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare overall technological progress of each empire or federation',
    TechProgressChart,
    'Leaderboard'
)
