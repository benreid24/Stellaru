import React, {useState, useEffect} from 'react';

import {VictoryLine, VictoryAxis, VictoryLabel} from 'victory';
import {Chart} from './Charts';

import {transform, selectNested, dateTickFormat} from './Util';

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
            newData[newData.length-1].label = String(value);
        }
        setData(newData);
    }, [props.data]);

    return (
        <Chart width='100%' height={300} title='Net Monthly Energy Credits' titleColor='#e8db27'>
            <VictoryLine
                style={{
                    data: {stroke: '#e8db27'},
                    labels: {fill: '#d2d2d2'}
                }}
                data={data}
            />
            <VictoryAxis crossAxis
                tickFormat={dateTickFormat}
                label='Date'
                style={{
                    axisLabel: {fill: '#9a9a9a'}
                }}
            />
            <VictoryAxis dependentAxis
                label='Energy Credits'
                style={{axisLabel: {fill: '#e8db27'}}}
            />
        </Chart>
    );
}

export default StellaruLines;
