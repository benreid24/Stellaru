import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested, valueTickFormat} from '../Util';
import {registerChart} from '../../ChartRegistry';

import './Military.css';

function WarOverview(props) {
    const data = props.data;
    const height = props.height;

    const fleetCount = data.length > 0 ? selectNested('fleets/total', data[data.length-1], 0) : 0;
    const shipCount = data.length > 0 ? selectNested('fleets/ships/total', data[data.length-1], 0) : 0;
    const fleetPower = data.length > 0 ? valueTickFormat(selectNested('fleets/fleet_power/total', data[data.length-1], 0)) : 0;

    return (
        <Chart overlay={props.overlay} title='War Overview' titleColor='#de1212'>
            <div className='warOverviewChart'>
                <LineChart
                    data={data}
                    lines={[
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
                    ]}
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
    'War Overview',
    'Displays the number of concurrent wars over time, as well as offensive and defensive wars. Includes a breakdown of the current fleet as well',
    WarOverview
);

export default WarOverview;
