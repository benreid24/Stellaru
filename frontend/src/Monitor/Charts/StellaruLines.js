import React, {useState, useEffect} from 'react';

import {VictoryLine, VictoryAxis} from 'victory';
import {Chart} from './Charts';

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

            <svg x={20} y={170} width={500} height={150}>
                <rect x={0} y={0} width={6} height={6} style={{fill: '#e8db27'}}/>
                <text x={10} y={6} fill='#fdfdfd' fontSize={8} fontWeight={100} strokeWidth={0}>Energy Credits</text>
            </svg>
        </Chart>
    );
}

export default StellaruLines;
