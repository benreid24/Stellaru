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
    transform,
    selectNested
};
