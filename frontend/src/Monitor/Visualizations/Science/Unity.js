import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Unity';

function Unity(props) {
    const name = props.name ? props.name : 'unity';
    const data = props.data;

    const lines = [
        {
            label: translate('Unity Income'),
            selector: snap => selectNested('economy/income/unity/total', snap),
            yAxis: 'right'
        },
        {
            label: translate('Unity Stockpile'),
            selector: snap => selectNested('economy/stockpile/unity', snap),
            yAxis: 'right'
        },
        {
            label: translate('Adopted Trees'),
            selector: snap => selectNested('unity/adopted_trees', snap)
        },
        {
            label: translate('Adopted Traditions'),
            selector: snap => selectNested('unity/traditions', snap)
        },
        {
            label: translate('Completed Trees'),
            selector: snap => selectNested('unity/finished_trees', snap)
        },
        {
            label: translate('Ascension Perks'),
            selector: snap => selectNested('unity/ascension_perks', snap)
        }
    ]

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Unity')} titleColor='#0b9cbd'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel={translate('Count')}
                rightYLabel={translate('Unity')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows Unity income and stockpile alongside adopted traditions over time',
    Unity,
    'Science'
);

export default Unity;
