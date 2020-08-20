import React from 'react';

import {getTextWidth} from './Util';

const MaxWidth = 500;
const FontSize = 8;
const BoxSize = 6;
const BoxPadding = 4;

const PresetColors = Object.freeze({
    'Energy Credits': '#e8db27',
    minerals: '#de2222'
}); // TODO - actual names and colors

const ItemColors = Object.freeze([
    'red',
    'green',
    'blue'
]); // TODO - more colors. make them match

function createLegendItemsFromLabels(labels) {
    let items = [];
    for (let i in labels) {
        items.push({
            label: labels[i]
        });
    }
    return items;
}

function assignLegendColors(items) {
    let colorIndex = 0;
    for (let i in items) {
        if (items[i].label in PresetColors)
            items[i].color = PresetColors[items[i].label];
        else {
            items[i].color = ItemColors[colorIndex];
            colorIndex += 1;
            if (colorIndex >= ItemColors.length)
                colorIndex = 0;
        }
    }
}

function createLegendItems(labels) {
    let items = createLegendItemsFromLabels(labels);
    assignLegendColors(items);
    return items;
}

function LegendItem(props) {
    return (
        <svg x={props.x} y={props.y} width={props.width} height={props.height}>
            <rect x={0} y={0} width={BoxSize} height={BoxSize} style={{fill: props.color}}/>
            <text x={BoxSize+BoxPadding} y={6} fontSize={FontSize} fontWeight={100} strokeWidth={0} fill='#fdfdfd'>
                {props.label}
            </text>
        </svg>
    );
}

function Legend(props) {
    const items = props.items;
    let x = 20;
    let y = props.chartHeight - 30;

    let renderedItems = [];
    for (let i in items) {
        const item = items[i];
        const width = getTextWidth(item.label) + BoxSize;

        if (x + width >= MaxWidth) {
            x = 20;
            y += 14;
        }

        renderedItems.push(
            <LegendItem key={item.label} x={x} y={y} width={width} height={10} color={item.color} label={item.label}/>
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
    createLegendItemsFromLabels,
    assignLegendColors,
    createLegendItems,
    Legend
};
