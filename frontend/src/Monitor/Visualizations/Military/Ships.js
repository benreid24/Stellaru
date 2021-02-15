import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import AreaChart from 'Monitor/Charts/AreaChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {findKeysOverSeries, selectNested} from 'Monitor/Charts/Util';
import {capitalize} from 'Helpers';
import {translate} from 'Translator';

const Name = 'Ship Types';

function Ships(props) {
    const name = props.name ? props.name : 'ships';
    const data = props.data;

    const keys = findKeysOverSeries(data, 'fleets/ship_types');
    const lines = keys.map(key => {
        return {
            label: translate(capitalize(key, '_')),
            selector: snap => selectNested(`fleets/ship_types/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Ship Types')} titleColor='#de1212'>
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
    'Displays number of ships by type over time',
    Ships,
    'Military'
);

export default Ships;
