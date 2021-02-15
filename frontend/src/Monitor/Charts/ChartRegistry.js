import React from 'react';

import {getAllCharts as getCustomCharts, chartExists, getChart as getCustomChart} from 'Monitor/Visualizations/Custom/CustomChartRepository';
import CustomChart from 'Monitor/Visualizations/Custom/CustomChart';

let registeredCharts = {};
let addedCharts = [];

const CustomChartWrapper = (props, chart) => {
    return <CustomChart chart={chart} {...props}/>
};

const makeChartFromCustom = custom => {
    return {
        name: custom.name,
        description: 'User defined chart',
        component: props => CustomChartWrapper(props, custom),
        category: 'Custom'
    };
};

function registerChart(name, description, component, category) {
    registeredCharts[name] = {
        name: name,
        description: description,
        component: component,
        category: category
    };
}

function getChart(name) {
    if (name in registeredCharts) {
        return registeredCharts[name];
    }
    if (chartExists(name)) {
        return makeChartFromCustom(getCustomChart(name));
    }
    return null;
}

function getAllCharts() {
    let charts = Object.values(registeredCharts);
    let customCharts = getCustomCharts();
    customCharts = customCharts.map(makeChartFromCustom);
    return [...charts, ...customCharts];
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
