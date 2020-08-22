import React from 'react';

function TabPanel(props) {
    const currentTab = props.value;
    const index = props.index;
    const display = currentTab === index ? 'block' : 'none';

    return (
        <div style={{display: display}}>
            {currentTab === index && props.children}
        </div>
    );
}

export default TabPanel;
