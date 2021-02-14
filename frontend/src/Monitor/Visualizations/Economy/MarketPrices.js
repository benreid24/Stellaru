import React from 'react';

import Chart from 'Monitor/Charts/Chart';
import LineChart from 'Monitor/Charts/LineChart';
import {registerChart} from 'Monitor/Charts/ChartRegistry';
import {findKeysOverSeries, selectNested} from 'Monitor/Charts/Util';
import {getResourceName, filterResources} from './Util';
import {translate} from 'Translator';

const Name = 'Market Prices';

function MarketPrices(props) {
    const name = props.name ? props.name : 'market_prices';
    const data = props.data;

    const keys = filterResources(findKeysOverSeries(data, 'economy/market_prices'));
    const lines = keys.map(key => {
        return {
            label: translate(getResourceName(key)),
            selector: snap => selectNested(`economy/market_prices/${key}`, snap)
        };
    });

    return (
        <Chart name={Name} overlay={props.overlay} title={translate('Market Prices')} titleColor='#ded140'>
            <LineChart
                name={name}
                data={data}
                yAxisLabel={translate('Energy Credits')}
                lines={lines}
            />
        </Chart>
    );
}

registerChart(
    Name,
    'shows market prices of publicly traded commodities over time',
    MarketPrices,
    'Economy'
);

export default MarketPrices;
