import React from 'react';

import Chart from '../Chart';
import AreaChart from '../AreaChart';
import {selectNested, findKeysOverSeries} from '../Util';
import {registerChart} from '../../ChartRegistry';
import {translate} from '../../../Translator';

const Name = 'Jobs';

function Jobs(props) {
    const name = props.name ? props.name : 'jobs';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'pops/jobs');
    const areas = keys.map(key => {
        return {
            label: translate(key),
            selector: snap => selectNested(`pops/jobs/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Jobs')} titleColor='#65c73c'>
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
    Name,
    'Shows available jobs by type over time',
    Jobs
);

export default Jobs;
