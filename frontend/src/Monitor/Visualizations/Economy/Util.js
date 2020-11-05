import {capitalize} from 'Helpers';

const resourceNames = Object.freeze({
    sr_dark_matter: 'Dark Matter',
    energy: 'Energy Credits',
    sr_zro: 'Zro',
    sr_living_metal: 'Living Metal'
});

const filteredResources = Object.freeze([
    'physics_research',
    'society_research',
    'engineering_research',
    'unity'
]);

function getResourceName(key) {
    if (resourceNames.hasOwnProperty(key))
        return resourceNames[key];
    return capitalize(key, '_');
}

function filterResources(keys) {
    return keys.filter(key => !filteredResources.includes(key));
}

function nonNull(data, selector) {
    for (let i = 0; i < data.length; i += 1) {
        const v = selector(data[i]);
        if (v !== null && v !== 0) {
            return true;
        }
    }
    return false;
}

export {
    getResourceName,
    filterResources,
    nonNull
}
