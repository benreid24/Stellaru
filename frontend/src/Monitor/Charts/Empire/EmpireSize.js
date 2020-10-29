import React from 'react';

import Chart from '../Chart';
import LineChart from '../LineChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from '../../../Translator';

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
                rightYLabel={translate('Sprawl &amp; Pops')}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows size of the empire over time',
    EmpireSize
);

export default EmpireSize;
