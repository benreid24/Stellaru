let currentTab = 'stellaru-tab-0';

function setCurrentTab(tab) {
    currentTab = tab;
}

function getCurrentTab(tab) {
    return currentTab;
}

export {
    setCurrentTab,
    getCurrentTab
}
