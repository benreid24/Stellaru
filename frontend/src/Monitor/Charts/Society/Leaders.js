import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Leaders(props) {
    const name = props.name ? props.name : 'leaders';
    const data = props.data;

    const areas = [
        {
            label: 'Scientist',
            selector: snap => selectNested('leaders/scientist', snap)
        },
        {
            label: 'Admiral',
            selector: snap => selectNested('leaders/admiral', snap)
        },
        {
            label: 'General',
            selector: snap => selectNested('leaders/general', snap)
        },
        {
            label: 'Envoy',
            selector: snap => selectNested('leaders/envoy', snap)
        },
        {
            label: 'Governor',
            selector: snap => selectNested('leaders/governor', snap)
        },
        {
            label: 'Ruler',
            selector: snap => selectNested('leaders/ruler', snap)
        },
    ];

    return (
        <Chart overlay={props.overlay} title='Leaders' titleColor='#65c73c'>
            <AreaChart
                name={name}
                data={data}
                allowIsolation={true}
                stack={true}
                areas={areas}
            />
        </Chart>
    );
}

registerChart(
    'Leaders',
    'Shows leader count and breakdown over time',
    Leaders
);

export default Leaders;
