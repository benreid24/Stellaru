import React from 'react';

import Chart from '../Chart';
import ComposedChart from '../ComposedChart';
import {selectNested, valueTickFormat, renderArea, renderLine} from '../Util';
import {registerChart} from '../../ChartRegistry';

import './Military.css';

const Name = 'War Overview';

function WarOverview(props) {
    const name = props.name ? props.name : 'waroverview';
    const data = props.data;

    const fleetCount = data.length > 0 ? selectNested('fleets/total', data[data.length-1], 0) : 0;
    const shipCount = data.length > 0 ? selectNested('fleets/ships/total', data[data.length-1], 0) : 0;
    const fleetPower = data.length > 0 ? valueTickFormat(selectNested('fleets/fleet_power/total', data[data.length-1], 0)) : 0;

    const series = [
        {
            label: 'Active Empires',
            selector: snap => selectNested('active_empires', snap, 0),
            yAxis: 'right'
        },
        {
            label: 'Warring Empires',
            selector: snap => selectNested('war/total_participants', snap, 0),
            yAxis: 'right'
        },
        {
            label: 'All Wars',
            selector: snap => selectNested('war/total', snap, 0)
        },
        {
            label: 'Offensive Wars',
            selector: snap => selectNested('war/attacker', snap, 0)
        },
        {
            label: 'Defensive Wars',
            selector: snap => selectNested('war/defender', snap, 0)
        }
    ];
    const renderSeries = (series, labelColors, onClick) => {
        if (['All Wars', 'Active Empires', 'Warring Empires'].includes(series.label))
            return renderLine(series, labelColors[series.label], onClick);
        return renderArea(series, labelColors[series.label], '1', onClick);
    }

    return (
        <Chart name={Name} overlay={props.overlay} title='War Overview' titleColor='#de1212'>
            <div className='warOverviewChart'>
                <ComposedChart
                    name={name}
                    data={data}
                    series={series}
                    allowIsolation={true}
                    seriesRenderer={renderSeries}
                    yAxisLabel='War Count'
                    rightYLabel='Empire Count'
                />
            </div>
            <div className='militaryOverviewArea'>
                <h2 className='militaryOverviewLabel'>
                    Total Power: <span className='militaryOverviewNumber'>{fleetPower}</span>
                </h2>
                <h2 className='militaryOverviewLabel'>
                    Fleet Count: <span className='militaryOverviewNumber'>{fleetCount}</span>
                </h2>
                <h2 className='militaryOverviewLabel'>
                    Ship Count: <span className='militaryOverviewNumber'>{shipCount}</span>
                </h2>
            </div>
        </Chart>
    )
}

registerChart(
    Name,
    'Displays the number of concurrent wars over time, as well as offensive and defensive wars. Includes a breakdown of the current fleet as well',
    WarOverview
);

export default WarOverview;
