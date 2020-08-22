import React from 'react';

import LineChart from '../LineChart';
import {selectNested} from '../Util';

function RawScienceOutput(props) {
    const data = props.data;
    const height = props.height;

    return (
        <LineChart
            data={data}
            height={height}
            title='Science Output'
            titleColor='#0b9cbd'
            yAxisLabel='Monthly Research'
            showLabels={false}
            lines={[
                {
                    label: 'Physics Research',
                    selector: snap => selectNested('economy/net_income/physics_research', snap)
                },
                {
                    label: 'Society Research',
                    selector: snap => selectNested('economy/net_income/society_research', snap)
                },
                {
                    label: 'Engineering Research',
                    selector: snap => selectNested('economy/net_income/engineering_research', snap)
                }
            ]}
        />
    );
}

export default RawScienceOutput;
