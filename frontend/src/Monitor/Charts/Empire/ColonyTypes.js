import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import AreaChart from 'Monitor/Charts/AreaChart';
import {registerChart} from '../../ChartRegistry';
import {findKeysOverSeries, selectNested} from '../Util';
import {translate} from 'Translator';

const Name = 'Colony Types';

function ColonyTypes(props) {
    const name = props.name ? props.name : 'colonies';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'planets/types');
    const lines = keys.map(key => {
        return {
            label: translate(key),
            selector: snap => selectNested(`planets/types/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Colony Types')} titleColor='#96d636'>
            <AreaChart
                name={name}
                data={data}
                areas={lines}
                stack={true}
                allowIsolation={true}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'Shows number of colonies and type breakdown over time',
    ColonyTypes
);

export default ColonyTypes;
