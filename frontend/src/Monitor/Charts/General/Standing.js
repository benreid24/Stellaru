import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from '../../../Translator';

import './General.css';

const Name = 'General Game Standing';

function Standing(props) {
    const name = props.name ? props.name : 'standing';
    const data = props.data;
    const rank = data.length > 0 ? selectNested('standing/victory_rank', data[data.length-1]) : null;
    const title = rank ? `${translate('Standing')} (${translate('Rank')}: ${rank})` : translate('Standing');

    const keys = findKeysOverSeries(data, 'standing/victory_points');
    const areas = keys.map(key => {
        return {
            label: translate(key),
            selector: snap => selectNested(`standing/victory_points/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={title} titleColor='#96d636'>
            <div className='victoryPointChart'>
                <AreaChart
                    data={data}
                    yAxisLabel={translate('Victory Points')}
                    stack={true}
                    allowIsolation={true}
                    areas={areas}
                />
            </div>
            <div className='rankChart'>
                <LineChart
                    name={name}
                    data={data}
                    yAxisLabel={translate('Rank')}
                    lines={[
                        {
                            label: translate('Victory Rank'),
                            selector: snap => selectNested('standing/victory_rank', snap)
                        }
                    ]}
                />
            </div>
        </Chart>
    );
}

registerChart(
    Name,
    'Victory rank and victory points over time',
    Standing
);

export default Standing;
