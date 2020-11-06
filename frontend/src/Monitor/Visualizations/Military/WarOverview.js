import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import ComposedChart from 'Monitor/Charts/ComposedChart';
import {selectNested, valueTickFormat, renderArea, renderLine} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

import './Military.css';

const Name = 'War Overview';

function WarOverview(props) {
    const name = props.name ? props.name : 'waroverview';
    const data = props.data;

    const fleetCount = data.length > 0 ? selectNested('fleets/total', data[data.length-1], 0) : 0;
    const shipCount = data.length > 0 ? selectNested('fleets/ships/total', data[data.length-1], 0) : 0;
    const fleetPower = data.length > 0 ? valueTickFormat(selectNested('fleets/fleet_power/total', data[data.length-1], 0)) : 0;

    const areaRender = (series, labelColors, onClick) => renderArea(series, labelColors[series.label], '1', onClick);
    const lineRender = (series, labelColors, onClick) => renderLine(series, labelColors[series.label], onClick);
    const series = [
        {
            label: translate('Active Empires'),
            selector: snap => selectNested('active_empires', snap, 0),
            yAxis: 'right',
            renderer: lineRender
        },
        {
            label: translate('Warring Empires'),
            selector: snap => selectNested('war/all_participants', snap, 0),
            yAxis: 'right',
            renderer: lineRender
        },
        {
            label: translate('All Wars'),
            selector: snap => selectNested('war/total', snap, 0),
            renderer: lineRender
        },
        {
            label: translate('Offensive Wars'),
            selector: snap => selectNested('war/attacker', snap, 0),
            renderer: areaRender
        },
        {
            label: translate('Defensive Wars'),
            selector: snap => selectNested('war/defender', snap, 0),
            renderer: areaRender
        }
    ];

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('War Overview')} titleColor='#de1212'>
            <div className='warOverviewChart'>
                <ComposedChart
                    name={name}
                    data={data}
                    series={series}
                    allowIsolation={true}
                    yAxisLabel={translate('War Count')}
                    rightYLabel={translate('Empire Count')}
                />
            </div>
            <div className='militaryOverviewArea'>
                <h2 className='militaryOverviewLabel'>
                    {translate('Total Power')}: <span className='militaryOverviewNumber'>{fleetPower}</span>
                </h2>
                <h2 className='militaryOverviewLabel'>
                    {translate('Fleet Count')}: <span className='militaryOverviewNumber'>{fleetCount}</span>
                </h2>
                <h2 className='militaryOverviewLabel'>
                    {translate('Ship Count')}: <span className='militaryOverviewNumber'>{shipCount}</span>
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
