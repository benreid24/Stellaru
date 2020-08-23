import React from 'react';

import {VictoryChart, VictoryLabel, VictoryContainer} from 'victory';

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
    const height = props.height;
    const domain = props.domain;
    const yMin = props.yMin;

    return (
        <VictoryChart
            animate={{duration: 500}}
            theme={chartTheme}
            height={height}
            preserveAspectRatio="none"
            minDomain={{x: domain[0], y: yMin}}
            maxDomain={{x: domain[1]}}
            padding={props.padding}
        >
            {props.title ? <VictoryLabel text={props.title} textAnchor='start' dx={15} dy={15} style={{fill: props.titleColor}}/> : null}
            {props.children}
        </VictoryChart>
    );
}

export {Chart};
