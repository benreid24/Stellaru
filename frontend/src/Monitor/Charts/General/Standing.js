import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries} from '../Util';
import {registerChart} from '../../ChartRegistry';

import './General.css';

function Standing(props) {
    const name = props.name ? props.name : 'standing';
    const data = props.data;
    const rank = data.length > 0 ? selectNested('standing/victory_rank', data[data.length-1]) : null;
    const title = rank ? `Standing (Rank: ${rank})` : 'Standing';

    const keys = findKeysOverSeries(data, 'standing/victory_points');
    const areas = keys.map(key => {
        return {
            label: key,
            selector: snap => selectNested(`standing/victory_points/${key}`, snap)
        };
    });

    return (
        <Chart overlay={props.overlay} title={title} titleColor='#96d636'>
            <div className='victoryPointChart'>
                <AreaChart
                    data={data}
                    yAxisLabel='Victory Points'
                    stack={true}
                    allowIsolation={true}
                    areas={areas}
                />
            </div>
            <div className='rankChart'>
                <LineChart
                    name={name}
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
