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
    const height = props.height;
    const domain = props.domain;

    return (
        <div className='chart'>
            <VictoryChart
                animate={{duration: 500}}
                theme={chartTheme}
                height={height}
                minDomain={{x: domain[0]}}
                maxDomain={{x: domain[1]}}
            >
                <VictoryLabel text={props.title} textAnchor='start' dx={15} dy={15} style={{fill: props.titleColor}}/>
                {props.children}
            </VictoryChart>
        </div>
    );
}

export {Chart};
