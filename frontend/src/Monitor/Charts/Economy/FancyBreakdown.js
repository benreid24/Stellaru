import React from 'react';

import StackedAreaChart from '../StackedAreaChart';
import {selectNested} from '../Util';

function FancyBreakdown(props) {
    const data = props.data;
    const height = props.height;

    return (
        <div className='chart'>
            <StackedAreaChart
                data={data}
                height={height}
                title='Fancy Breakdown'
                titleColor='#ded140'
                showLabels={false}
                areas={[
                    {
                        label: 'Tech',
                        selector: snap => selectNested('standing/tech_power', snap)
                    },
                    {
                        label: 'Economy',
                        selector: snap => selectNested('standing/economy_power', snap)
                    },
                ]}
            />
        </div>
    );
}

export default FancyBreakdown;
