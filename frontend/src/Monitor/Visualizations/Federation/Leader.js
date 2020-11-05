import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {selectNested} from 'Monitor/Charts/Util';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {translate} from 'Translator';

const Name = 'Leading Federation';

function LeadingFederation(props) {
    const name = props.name ? props.name : 'LeadingFederation';
    const data = props.data;

    const lines = [
        {
            label: translate('Currently Leader'),
            selector: snap => selectNested('federation/leader', snap) ? 1 : 0,
        }
    ];

    const formatter = value => {
        if (value === 0) return 'False';
        if (value === 1) return 'True';
        return '';
    };

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Leading Federation')} titleColor='#127814'>
            <LineChart
                name={name}
                data={data}
                allowIsolation={true}
                formatter={formatter}
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows when currently leading a federation',
    LeadingFederation
);

export default LeadingFederation;
