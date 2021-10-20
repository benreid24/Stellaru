import React from 'react';

import {Line, Area} from 'recharts';
import {shuffle, objectKeys} from 'Helpers'

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
    'Unity Income': '#54dec9',
    'Unity Stockpile': '#18a38e',
    'Influence': '#a17da8',
    'Volatile Motes': '#c77f12',
    'Exotic Gases': '#1a960c',
    'Rare Crystals': '#ccba2f',
    'Dark Matter': '#8c00ba',
    'Available Society Techs': '#65c73c',
    'Available Physics Techs': '#3b94d4',
    'Available Engineering Techs': '#e39f0e',
    'Percent Male': '#68bef7',
    'Percent Female': '#ff4fe5',
    'Net Income': 'white'
};

const Saturation = 75;
const Hues = [0, 20, 40, 60, 150, 180, 220, 260, 335];
const Lumens = [60, 40, 80];

function getDataColors(labels, hues) {
    if (!hues)
        hues = shuffle(Hues);
    let colors = {};
    let hueIndex = 0;
    let lumenIndex = 0;
    for (let i in labels) {
        const label = labels[i];
        if (label in PresetColors) // TODO - translate preset colors before checking?
            colors[label] = PresetColors[label];
        else {
            const color = `hsl(${hues[hueIndex]}, ${Saturation}%, ${Lumens[lumenIndex]}%)`;
            colors[label] = color;
            hueIndex += 1;
            if (hueIndex >= hues.length) {
                hueIndex = 0;
                lumenIndex += 1;
                if (lumenIndex >= Lumens.length)
                    lumenIndex = 0;
            }
        }
    }
    return [colors, hues];
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

function findNested(path, data, alt) {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        const val = selectNested(path, data[i], null);
        if (val !== null)
            return val;
    }
    return alt;
}

function valueToString(value) {
    let s = value.toFixed(2);
    if (s.substring(s.length - 3) === '.00')
        return s.substring(0, s.length - 3);
    return s;
}

function valueTickFormat(value) {
    const sign = value >= 0 ? 1 : -1;
    value = Math.abs(value.toPrecision(3)*1);
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
    if (month === 0) month = 12;
    return `${year}.${String(month).padStart(2, '0')}${date_days === 1 ? '' : `.${String(date_days).padStart(2, '0')}`}`;
}

function percentValueFormat(percent) {
    if (!percent)
        return '0%';
    return `${percent.toFixed(2)}%`;
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

const makeId = label => label.replace(/[\s()]/g, '');

function renderLine(line, labelColor, onClick, strokeWidth=1) {
    return (
        <Line
            key={line.label}
            name={line.label}
            dataKey={line.label}
            yAxisId={line.yAxis ? line.yAxis : 'left'}
            type='monotone'
            dot={false}
            activeDot
            connectNulls={false}
            stroke={labelColor}
            isAnimationActive={true}
            onClick={onClick}
            strokeWidth={strokeWidth}
        />
    );
}

function renderArea(area, labelColor, stackId, onClick) {
    return (
        <Area
            key={area.label}
            name={area.label}
            dataKey={area.label}
            yAxisId={area.yAxis ? area.yAxis : 'left'}
            type='monotone'
            dot={false}
            activeDot
            strokeWidth={1}
            connectNulls={false}
            stroke={labelColor}
            fill={`url(#${area.labelId})`}
            stackId={stackId}
            isAnimationActive={true}
            onClick={onClick}
        />
    );
}

export {
    dateTickFormat,
    valueTickFormat,
    percentValueFormat,
    selectNested,
    findNested,
    getDataColors,
    findKeysOverSeries,
    renderLine,
    renderArea,
    makeId
};
