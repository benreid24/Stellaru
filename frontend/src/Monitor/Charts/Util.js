import React from 'react';

import {Line, Area} from 'recharts';

const NumberSuffixes = [
    {suffix: 'b', value: 1000000000},
    {suffix: 'M', value: 1000000},
    {suffix: 'k', value: 1000}
];

const PresetColors = {
    'Energy Credits': '#e8db27',
    'Minerals': '#de2222',
    'Food': '#11de12',
    'Alloys': '#bd60b8',
    'Consumer Goods': '#cf8c06',
    'Society Research': '#65c73c',
    'Physics Research': '#3b94d4',
    'Engineering Research': '#e39f0e',
    'Tech': '#0aa7cf',
    'Economy': '#ded140',
    'Victory Rank': '#96d636',
    'Unity': '#54dec9',
    'Influence': '#a17da8',
    'Volatile Motes': '#c77f12',
    'Exotic Gases': '#1a960c',
    'Rare Crystals': '#ccba2f',
    'Dark Matter': '#8c00ba',
    'Available Society Techs': '#65c73c',
    'Available Physics Techs': '#3b94d4',
    'Available Engineering Techs': '#e39f0e',
}; // TODO - all names and colors

const ItemColors = ["#b6a7b4","#9ed695","#1ddfbc","#e2c496","#cd5889","#3e85bf","#f2cee7","#6d7f97","#67903c","#dc4b5a"];

function getDataColors(labels) {
    const newColors = shuffle(ItemColors);
    let colorIndex = 0;
    let colors = {};
    let usedColors = [];
    for (let i in labels) {
        const label = labels[i];
        if (label in PresetColors)
            colors[label] = PresetColors[label];
        else {
            while (usedColors.includes(newColors[colorIndex])) {
                colorIndex += 1;
                if (colorIndex >= newColors.length) {
                    colorIndex = 0;
                    break;
                }
            }
            colors[label] = newColors[colorIndex];
            PresetColors[label] = newColors[colorIndex];
            colorIndex += 1;
            if (colorIndex >= newColors.length)
                colorIndex = 0;
        }
        usedColors.push(colors[label]);
    }
    return colors;
}

function getTextWidth(text, fontSize) {
    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = `${fontSize}pt arial`;
    let metrics = context.measureText(text);
    return metrics.width;
}

function selectNested(path, object, alt=null) {
    try {
        const keys = path.split('/');
        let ref = object;
        for (let i in keys) {
            if (!ref)
                return alt;
            if (keys[i].length === 0)
                break;
            if (!(keys[i] in ref))
                return alt;
            ref = ref[keys[i]];
        }
        return ref;
    } catch (err) { return alt; }
}

function valueToString(value) {
    let s = value.toFixed(2);
    if (s.substring(s.length - 3) === '.00')
        return s.substring(0, s.length - 3);
    return s;
}

function valueTickFormat(value) {
    const sign = value >= 0 ? 1 : -1;
    value = Math.abs(value);
    for (let i in NumberSuffixes) {
        const suffix = NumberSuffixes[i];
        if (value >= suffix.value)
            return valueToString(sign * value/suffix.value) + suffix.suffix;
    }
    return valueToString(sign * value);
}

function dateTickFormat(date_days) {
    let year = Math.floor(date_days / 360);
    date_days -= year * 360;
    let month = Math.floor(date_days / 30);
    date_days -= month * 30;
    month += 1;
    return `${year}.${String(month).padStart(2, '0')}.${String(date_days).padStart(2, '0')}`;
}

function addAlphaChannel(color, alpha) {
    const r = parseInt(color.substring(1).slice(0,2), 16);
    const g = parseInt(color.substring(1).slice(2,4), 16);
    const b = parseInt(color.substring(1).slice(4,6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function objectKeys(object) {
    return Object.entries(object).map(([key, _]) => key);
}

function shuffle(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function findKeysOverSeries(data, topKey) {
    let keys = {};
    data.forEach(snap => {
        for (let key in selectNested(topKey, snap)) {
            if (!(key in keys)) {
                keys[key] = true;
            }
        }
    });
    return objectKeys(keys);
}

const makeId = label => label.replace(/\s/g, '');

function renderLine(line, labelColor) {
    return (
        <Line
            key={line.label}
            name={line.label}
            dataKey={line.label}
            type='monotone'
            dot={false}
            activeDot
            strokeWidth={1}
            connectNulls={false}
            stroke={labelColor}
        />
    );
}

function renderArea(area, labelColor, stackId) {
    return (
        <Area
            key={area.label}
            name={area.label}
            dataKey={area.label}
            type='monotone'
            dot={false}
            activeDot
            strokeWidth={1}
            connectNulls={false}
            stroke={labelColor}
            fill={`url(#${makeId(area.label)})`}
            stackId={stackId}
        />
    );
}

export {
    addAlphaChannel,
    dateTickFormat,
    valueTickFormat,
    selectNested,
    getTextWidth,
    getDataColors,
    objectKeys,
    findKeysOverSeries,
    shuffle,
    renderLine,
    renderArea,
    makeId
};
