import React from 'react';
import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {useLeaderboardContext} from '../Context';
import {getTimeseries, sumReducer} from '../Selectors';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {LeaderboardChartProps} from './Types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

type ChartedValue = 'pops' | 'planets' | 'systems';
const Labels: Record<ChartedValue, string> = {
    'pops': 'Total Pops',
    'planets': 'Total Colonies',
    'systems': 'Total Systems'
}

const Name = 'Aggregate Size';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export const EmpireSize: React.FC<LeaderboardChartProps> = ({data, name: n, overlay}) => {
    const classes = useStyles();

    const name = n ? n : Name;
    const {groupState, filterState, labelColors} = useLeaderboardContext();

    const [chartedValue, setChartedValue] = React.useState<ChartedValue>('systems');
    const onChartChange = (event: any) => setChartedValue(event.target.value);

    const selector = (snap: any, eid: number) => {
        switch (chartedValue) {
            case 'systems':
                return selectNested(`leaderboard/empire_summaries/${eid}/system_count`, snap);
            case 'planets':
                return selectNested(`leaderboard/empire_summaries/${eid}/planets/count`, snap);
            case 'pops':
                return selectNested(`leaderboard/empire_summaries/${eid}/pop_count`, snap);
            default:
                return 0;
        }
    };

    const series = getTimeseries(data, groupState, filterState, selector, sumReducer);

    return (
        <Chart name={name} title={Name} titleColor='#f50057' overlay={overlay}>
            <div className='leaderboardChartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={chartedValue} onChange={onChartChange}>
                        <MenuItem value='systems'>{Labels['systems']}</MenuItem>
                        <MenuItem value='planets'>{Labels['planets']}</MenuItem>
                        <MenuItem value='pops'>{Labels['pops']}</MenuItem>
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
                    labelColors={labelColors}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Compare empire or federation populations, colony counts, and number of systems',
    EmpireSize,
    'Leaderboard'
)
