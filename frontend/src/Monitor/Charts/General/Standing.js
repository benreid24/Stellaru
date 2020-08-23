import React from 'react';

import LineChart from '../LineChart';
import {selectNested} from '../Util';

function Standing(props) {
    const data = props.data;
    const height = props.height;
    const rank = data.length > 0 ? selectNested('standing/victory_rank', data[data.length-1]) : null;
    const title = rank ? `Standing (Rank: ${rank})` : 'Standing';

    return (
        <div className='chart'>
            <div>
                <LineChart
                    data={data}
                    height={height}
                    title={title}
                    titleColor='#96d636'
                    showLabels={false}
                    lines={[
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
        </div>
    );
}

export default Standing;
