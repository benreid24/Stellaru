import React from 'react';

import {VictoryChart} from 'victory';

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
                {props.children}
            </VictoryChart>
        </div>
    );
}

export {Chart};
