import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Empire Size';

function EmpireSize(props) {
    const name = props.name ? props.name : 'empiresize';
    const data = props.data;

    const lines = [
        {
            label: translate('Owned Systems'),
            selector: snap => selectNested('systems/owned', snap)
        },
        {
            label: translate('Starbases'),
            selector: snap => selectNested('systems/starbases', snap)
        },
        {
            label: translate('Colonies'),
            selector: snap => selectNested('planets/total', snap)
        },
        {
            label: translate('Population'),
            selector: snap => selectNested('pops/total', snap),
            yAxis: 'right'
        },
        {
            label: translate('Spawl'),
            selector: snap => selectNested('sprawl', snap),
            yAxis: 'right'
        }
    ];

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Empire Size')} titleColor='#96d636'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                lines={lines}
                yAxisLabel={translate('Count')}
                rightYLabel={translate('Sprawl & Pops')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows size of the empire over time',
    EmpireSize,
    'Empire'
);

export default EmpireSize;
