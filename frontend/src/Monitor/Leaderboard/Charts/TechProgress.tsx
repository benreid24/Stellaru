import React from 'react';
import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {GROUP_REDUCER, useLeaderboardContext} from '../Context';
import {getTimeseries} from '../Selectors';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {LeaderboardChartProps} from './Types';
import {makeStyles} from '@material-ui/core/styles';

const Name = 'Tech Progress';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export const TechProgressChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState, groupReducer} = useLeaderboardContext();

    const selector = (snap: any, eid: number) => {
        return selectNested(`leaderboard/empire_summaries/${eid}/tech/completed_techs`, snap);
    };
    const series = getTimeseries(data, groupState, filterState, selector, GROUP_REDUCER[groupReducer]);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
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
