import React from 'react';

import Chart from '../Chart';
import ComposedChart from '../ComposedChart';
import {selectNested, renderLine, renderArea} from '../Util';
import {registerChart} from '../../ChartRegistry';

function Technologies(props) {
    const name = props.name ? props.name : 'technologies';
    const data = props.data;

    const series = [
        {
            label: 'Researched Technologies',
            selector: snap => selectNested('tech/completed_techs', snap),
            yAxis: 'right'
        },
        {
            label: 'Available Engineering Techs',
            selector: snap => selectNested('tech/available_techs/engineering', snap)
        },
        {
            label: 'Available Society Techs',
            selector: snap => selectNested('tech/available_techs/society', snap)
        },
        {
            label: 'Available Physics Techs',
            selector: snap => selectNested('tech/available_techs/physics', snap)
        }
    ];
    const renderer = (series, labelColors) => {
        if (series.label === 'Researched Technologies')
            return renderLine(series, labelColors[series.label]);
        return renderArea(series, labelColors[series.label], '1');
    }

    return (
        <Chart overlay={props.overlay} title='Technologies' titleColor='#0b9cbd'>
            <ComposedChart
                name={name}
                data={data}
                allowIsolation={true}
                series={series}
                seriesRenderer={renderer}
                yAxisLabel='Available Techs'
                rightYLabel='Researched Techs'
            />
        </Chart>
    );
}

registerChart(
    'Technologies',
    'Shows completed and available technologies over time',
    Technologies
);

export default Technologies;
