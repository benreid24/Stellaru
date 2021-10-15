import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import React from 'react';
import {useLeaderboardContext} from '../Context';
import {getTimeseries} from '../Selectors';
import {registerChart} from 'Monitor/Charts/ChartRegistry';

const Name = 'Leaderboard Test Chart';

export type LeaderboardChartProps = {
    data: any[];
    name?: string;
}

export const TestChart: React.FC<LeaderboardChartProps> = ({data, name: n}) => {
    const name = n ? n : Name;
    const {groupState} = useLeaderboardContext();

    const selector = (snap: any, eid: number) => {
        return selectNested(`leaderboard/empire_summaries/${eid}/sprawl`, snap);
    };
    const series = getTimeseries(groupState, selector);

    return (
        <Chart name={name} title={name} titleColor='#6666cd'>
            <LineChart
                name={name}
                data={data}
                lines={series.map(gts => gts.timeseries)}
                allowIsolation={false}
                yAxisLabel='Sprawl'
            />
        </Chart>
    )
}

registerChart(
    Name,
    'Testing chart for leaderboard functionality',
    TestChart,
    'Leaderboard'
)
