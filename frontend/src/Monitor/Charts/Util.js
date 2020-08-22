const NumberSuffixes = [
    {suffix: 'b', value: 1000000000},
    {suffix: 'M', value: 1000000},
    {suffix: 'k', value: 1000}
];

const PresetColors = Object.freeze({
    'Energy Credits': '#e8db27',
    'Minerals': '#de2222',
    'Food': '#11de12',
    'Alloys': '#bd60b8',
    'Consumer Goods': '#cf8c06'
}); // TODO - actual names and colors

const ItemColors = Object.freeze([
    'red',
    'green',
    'blue'
]); // TODO - more colors. make them match

function getDataColors(labels) {
    let colorIndex = 0;
    let colors = {};
    for (let i in labels) {
        const label = labels[i];
        if (label in PresetColors)
            colors[label] = PresetColors[label];
        else {
            colors[label] = ItemColors[colorIndex];
            colorIndex += 1;
            if (colorIndex >= ItemColors.length)
                colorIndex = 0;
        }
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

function selectNested(path, object) {
    const keys = path.split('/');
    let ref = object;
    for (let i in keys) {
        if (!(keys[i] in ref))
            return null;
        ref = ref[keys[i]];
    }
    return ref;
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

export {
    dateTickFormat,
    valueTickFormat,
    selectNested,
    getTextWidth,
    getDataColors
};
