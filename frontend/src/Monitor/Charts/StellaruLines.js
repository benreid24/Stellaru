import React, {useState, useEffect} from 'react';

import {VictoryLine, VictoryAxis} from 'victory';
import {Chart} from './Charts';

import {Legend, createLegendItems} from './Legend';
import {transform, selectNested, valueTickFormat, dateTickFormat} from './Util';

import './Charts.css';

function StellaruLines(props) {
    const [data, setData] = useState([]);

    const netEnergy = (snap) => {
        const energy = selectNested('economy/net_income/energy', snap);
        const days = selectNested('date_days', snap);
        return {x: days, y: energy};
    }

    useEffect(() => {
        const newData = transform(props.data, netEnergy);
        if (newData.length > 0) {
            let value = Math.round(newData[newData.length-1].y);
            newData[newData.length-1].label = valueTickFormat(value);
        }
        setData(newData);
    }, [props.data]);

    return (
        <Chart height={200} title='Net Monthly Energy Credits' titleColor='#e8db27'>
            <VictoryLine
                style={{
                    data: {stroke: '#e8db27'},
                    labels: {fill: '#d2d2d2'}
                }}
                data={data}
            />
            <VictoryAxis crossAxis
                tickFormat={dateTickFormat}
                
                style={{
                    axisLabel: {fill: '#9a9a9a'}
                }}
            />
            <VictoryAxis dependentAxis
                label='Energy Credits'
                tickFormat={valueTickFormat}
                style={{axisLabel: {fill: '#e8db27'}}}
            />

            <Legend items={createLegendItems(['Energy Credits', 'minerals', 'another thing', 'and another', 'testing many', 'do these wrap', 'lets find out', 'testing one two three'])} chartHeight={200}/>

            
        </Chart>
    );
}

export default StellaruLines;
