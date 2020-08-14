import React from 'react';

import {VictoryChart, VictoryLabel} from 'victory';

import './Charts.css';

const chartTheme = {
    axis: {
        style: {
            tickLabels: {
                fill: '#dedede',
                fontSize: 9,
                padding: 5
            },
            grid: {
                fill: 'none',
                stroke: 'none'
            }
        }
    },
};

function Chart(props) {
    return (
        <div className='chart'>
            <VictoryChart animate={{duration: 500}} theme={chartTheme}>
            <VictoryLabel text={props.title} textAnchor='start' dx={15} dy={10} style={{fill: props.titleColor}}/>
                {props.children}
            </VictoryChart>
        </div>
    );
}

export {Chart};
