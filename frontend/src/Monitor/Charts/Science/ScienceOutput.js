import React from 'react';

import StackedAreaChart from '../StackedAreaChart';
import {selectNested, valueTickFormat} from '../Util';
import {registerChart} from '../../ChartRegistry';

import './Science.css';

function ScienceOutput(props) {
    const data = props.data;
    const height = props.height;

    let total = 0;
    if (data.length > 0) {
        total += selectNested('economy/net_income/physics_research', data[data.length-1]);
        total += selectNested('economy/net_income/society_research', data[data.length-1]);
        total += selectNested('economy/net_income/engineering_research', data[data.length-1]);
    }
    total = valueTickFormat(total);
    const completedTechs = data.length > 0 ? selectNested('tech/completed_techs', data[data.length-1]) : 0;
    const availableTechs = data.length > 0 ?
        selectNested('tech/available_techs/engineering', data[data.length-1]) +
        selectNested('tech/available_techs/physics', data[data.length-1]) +
        selectNested('tech/available_techs/society', data[data.length-1]) : 0;

    return (
        <div className='chart'>
            <div>
                <StackedAreaChart
                    data={data}
                    height={height}
                    title='Science Output'
                    titleColor='#0b9cbd'
                    yAxisLabel='Monthly Research'
                    showLabels={false}
                    areas={[
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
                <div className='row'>
                    <div className='col-3 align-self-center'>
                        <h2 className='scienceTotal'>Total: <span className='scienceTotalNumber'>{total}</span></h2>
                    </div>
                    <div className='col-4 align-self-center'>
                        <h2 className='scienceTotal'>Completed: <span className='scienceTotalNumber'>{completedTechs}</span></h2>
                    </div>
                    <div className='col-4 align-self-center'>
                        <h2 className='scienceTotal'>Available: <span className='scienceTotalNumber'>{availableTechs}</span></h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

registerChart(
    'Science Output',
    'Displays the science output over time, broken down by type. Also displays the number of researched techs and currently available techs',
    ScienceOutput
);

export default ScienceOutput;
