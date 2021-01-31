function getSnapshotKeyBreakdown(object) {
    if (typeof object == 'number') return null;

    return Object.entries(object)
        .filter(([_, value]) => typeof value == 'object' || typeof value == 'number')
        .map(([key, value]) => {return {key: key, value: getSnapshotKeyBreakdown(value)}})
        .sort((left, right) => {
            if (left.key < right.key)
                return -1;
            if (right.key < left.key)
                return 1;
            return 0;
        });
}

const findDataKey = (list, key) => {
    for (const obj of list) {
        if (key === obj.key)
            return obj;
    }
    return null;
};

const combine = (existingList, newList) => {
    if (existingList == null || newList == null) return;

    newList.forEach(obj => {
        let existingObj = findDataKey(existingList, obj.key);
        if (existingObj == null) {
            existingList.push(obj);
        }
        else {
            combine(existingObj.value, obj.value);
        }
    })
};

function getSeriesKeyBreakdown(data) {
    let result = [];
    data.forEach(snap => {
        combine(result, getSnapshotKeyBreakdown(snap));
    });
    return result;
}

function getNextDataLevel(currentData, key) {
    if (key !== null)
        return findDataKey(currentData, key);
    let result = [];
    currentData.forEach(obj => {
        combine(result, obj.value);
    });
    if (result.length === 0 || result.includes(null))
        return null;
    return {
        key: key,
        value: result
    };
}

export {
    getSeriesKeyBreakdown,
    findDataKey,
    getNextDataLevel
}
