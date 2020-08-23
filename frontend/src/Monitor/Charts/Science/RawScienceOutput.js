import React from 'react';

import LineChart from '../LineChart';
import {selectNested, valueTickFormat} from '../Util';

import './Science.css';

function RawScienceOutput(props) {
    const data = props.data;
    const height = props.height;

    let total = 0;
    if (data.length > 0) {
        total += selectNested('economy/net_income/physics_research', data[data.length-1]);
        total += selectNested('economy/net_income/society_research', data[data.length-1]);
        total += selectNested('economy/net_income/engineering_research', data[data.length-1]);
    }
    total = valueTickFormat(total);

    return (
        <div className='chart'>
            <div>
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
            </div>
            <div className='scienceTotalArea'>
                <h2 className='scienceTotal'> Total: <span className='scienceTotalNumber'>{total}</span></h2>
            </div>
        </div>
    );
}

export default RawScienceOutput;
