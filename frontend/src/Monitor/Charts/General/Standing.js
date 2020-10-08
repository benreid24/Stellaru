import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import AreaChart from '../AreaChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

import './General.css';

function Standing(props) {
    const data = props.data;
    const rank = data.length > 0 ? selectNested('standing/victory_rank', data[data.length-1]) : null;
    const title = rank ? `Standing (Rank: ${rank})` : 'Standing';

    return (
        <Chart overlay={props.overlay} title={title} titleColor='#96d636'>
            <div className='victoryPointChart'>
                <AreaChart
                    data={data}
                    yAxisLabel='Victory Points'
                    stack={true}
                    allowIsolation={true}
                    areas={[
                        {
                            label: 'Tech',
                            selector: snap => selectNested('standing/tech_power', snap)
                        },
                        {
                            label: 'Economy',
                            selector: snap => selectNested('standing/economy_power', snap)
                        },
                    ]}
                />
            </div>
            <div className='rankChart'>
                <LineChart
                    name='standing'
                    data={data}
                    yAxisLabel='Rank'
                    lines={[
                        {
                            label: 'Victory Rank',
                            selector: snap => selectNested('standing/victory_rank', snap)
                        }
                    ]}
                />
            </div>
        </Chart>
    );
}

registerChart(
    'General Game Standing',
    'Victory rank and victory points over time',
    Standing
);

export default Standing;
