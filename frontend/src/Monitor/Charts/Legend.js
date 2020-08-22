import React from 'react';

import {getTextWidth} from './Util';

const MaxWidth = 500;
const FontSize = 8;
const BoxSize = 6;
const BoxPadding = 4;
const Gutter = 10;

function LegendItem(props) {
    return (
        <svg x={props.x} y={props.y} width={props.width} height={props.height} onClick={props.onClick} style={{cursor: 'pointer'}}>
            <rect x={0} y={0} width={BoxSize} height={BoxSize} style={{fill: props.color}}/>
            <text x={BoxSize+BoxPadding} y={6} fontSize={FontSize} fontWeight={100} strokeWidth={0} fill='#fdfdfd'>
                {props.label}
            </text>
        </svg>
    );
}

function Legend(props) {
    const labels = props.labels;
    let x = 20;
    let y = props.chartHeight - 25;

    const onClick = (item) => {
        console.log(item);
    }

    let renderedItems = [];
    for (let label in labels) {
        const color = labels[label];
        const width = getTextWidth(label) + BoxSize + Gutter;

        if (x + width >= MaxWidth) {
            x = 20;
            y += 14;
        }

        renderedItems.push(
            <LegendItem
                key={label} x={x} y={y}
                width={width} height={10}
                color={color} label={label}
                onClick={() => onClick(label)}
            />
        );
        x += width;
    }

    return (
        <g>
            {renderedItems}
        </g>
    );
}

export {
    Legend
};
