import {capitalize} from '../Util';

const resourceNames = Object.freeze({
    sr_dark_matter: 'Dark Matter',
    energy: 'Energy Credits',
    sr_zro: 'Zro'
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

export {
    getResourceName,
    filterResources
}
