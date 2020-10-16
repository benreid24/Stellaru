let registeredCharts = {};
let addedCharts = [];

function registerChart(name, description, component) {
    registeredCharts[name] = {
        name: name,
        description: description,
        component: component
    };
}

function getChart(name) {
    if (name in registeredCharts) {
        return registeredCharts[name];
    }
    return null;
}

function getAllCharts() {
    return Object.entries(registeredCharts).map(kv => kv[1]);
}

function addChart(name) {
    addedCharts.push(name);
}

function getAddedCharts() {
    return addedCharts;
}

function clearAdded() {
    addedCharts = [];
}

export {
    registerChart,
    getChart,
    getAllCharts,
    addChart,
    getAddedCharts,
    clearAdded
}
