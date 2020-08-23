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
                    height={height*2/3}
                    title={title}
                    titleColor='#96d636'
                    showLabels={false}
                    padding={{top: 30, left: 50, right: 50, bottom: 47}}
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
            <div>
                <LineChart
                    data={data}
                    height={height/3}
                    showLabels={true}
                    padding={{top: 0, left: 50, right: 50, bottom: 47}}
                    lines={[
                        {
                            label: 'Victory Rank',
                            selector: snap => selectNested('standing/victory_rank', snap)
                        }
                    ]}
                />
            </div>
        </div>
    );
}

export default Standing;
