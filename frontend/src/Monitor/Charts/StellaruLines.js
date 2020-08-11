import React from 'react';

import {LineChart, CartesianGrid, XAxis, Label, YAxis, Line, ResponsiveContainer} from 'recharts';

import './Charts.css';

function StellaruLines(props) {
    const data = [
        {label: 'point 1', x: 1, y: 5},
        {label: 'point 2', x: 2, y: 7},
        {label: 'point 3', x: 3, y: 12},
        {label: 'point 4', x: 4, y: 25},
        {label: 'point 5', x: 5, y: 59},
    ];

    return (
        <div className='chart'>
            <ResponsiveContainer width='100%' height={300}>
                <LineChart data={data} syncId='what?'>
                    <CartesianGrid stroke='#bfbfbf' fill='#323232'/>
                    <XAxis type='number' dataKey='x' height={40} stroke='#dfdfdf'>
                        <Label value='X' position='insideBottom' fill='#dfdfdf'/>
                    </XAxis>
                    <YAxis type='number' dataKey='y' width={80} stroke='#dfdfdf'>
                        <Label value='Y' position='outside' fill='#dfdfdf'/>
                    </YAxis>
                    <Line key='myline' type='monotone' stroke='#cc7722' dataKey='y'/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StellaruLines;
