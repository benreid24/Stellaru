const NumberSuffixes = [
    {suffix: 'b', value: 1000000000},
    {suffix: 'M', value: 1000000},
    {suffix: 'k', value: 1000}
];

function transform(data, transform) {
    let transformed = data.slice();
    for (let i in transformed) {
        transformed[i] = transform(transformed[i]);
    }
    return transformed;
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
    transform,
    selectNested
};
