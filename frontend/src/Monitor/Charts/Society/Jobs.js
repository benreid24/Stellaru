import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Jobs(props) {
    const name = props.name ? props.name : 'jobs';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'pops/jobs');
    const areas = keys.map(key => {
        return {
            label: key,
            selector: snap => selectNested(`pops/jobs/${key}`, snap)
        };
    });

    return (
        <Chart overlay={props.overlay} title='Jobs' titleColor='#65c73c'>
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
    'Jobs',
    'Shows available jobs by type over time',
    Jobs
);

export default Jobs;
