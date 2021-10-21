import React from 'react';
import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {GROUP_REDUCER, useLeaderboardContext} from '../Context';
import {getTimeseries} from '../Selectors';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {LeaderboardChartProps} from './Types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

type ChartedValue = 'fleet_power' | 'ship_count' | 'fleet_size';
const Labels: Record<ChartedValue, string> = {
    'fleet_power': 'Total Fleet Strength',
    'ship_count': 'Total Ship Count',
    'fleet_size': 'Total Fleet Size'
}

const Name = 'Fleet Power';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export const FleetPowerChart: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState, groupReducer} = useLeaderboardContext();

    const [chartedValue, setChartedValue] = React.useState<ChartedValue>('fleet_power');
    const onChartChange = (event: any) => setChartedValue(event.target.value);

    const selector = (snap: any, eid: number) => {
        switch (chartedValue) {
            case 'fleet_power':
                return selectNested(`leaderboard/empire_summaries/${eid}/fleets/total_strength`, snap);
            case 'ship_count':
                return selectNested(`leaderboard/empire_summaries/${eid}/fleets/ship_count`, snap);
            case 'fleet_size':
                return selectNested(`leaderboard/empire_summaries/${eid}/fleets/total_size`, snap);
            default:
                return 0;
        }
    };

    const series = getTimeseries(data, groupState, filterState, selector, GROUP_REDUCER[groupReducer]);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={chartedValue} onChange={onChartChange}>
                        <MenuItem value='fleet_power'>{Labels['fleet_power']}</MenuItem>
                        <MenuItem value='ship_count'>{Labels['ship_count']}</MenuItem>
                        <MenuItem value='fleet_size'>{Labels['fleet_size']}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='leaderboardFormChartContent'>
                <LineChart
                    name={name}
                    data={data}
                    lines={series.map(gts => gts.timeseries)}
                    allowIsolation={false}
                    yAxisLabel={Labels[chartedValue]}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare fleet strength between empires and federations',
    FleetPowerChart,
    'Leaderboard'
)
