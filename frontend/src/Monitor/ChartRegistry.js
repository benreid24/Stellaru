let registeredCharts = {};

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

export {
    registerChart,
    getChart,
    getAllCharts
}
