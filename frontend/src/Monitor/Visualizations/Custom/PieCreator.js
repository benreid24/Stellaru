import React from 'react';
import DataSelector from './DataSelector';
import {getSeriesKeyBreakdown} from './CustomChartRepository';

import Button from '@material-ui/core/Button';

function TimeSeriesCreator(props) {
    const data = props.data;
    const chart = props.chart;
    const setChart = props.setChart;
    const dataFormat = getSeriesKeyBreakdown(data);

    const defaultSeries = {
        data: [],
        label: ''
    };

    const onAdd = () => {
        setChart({
            ...chart,
            pie: {
                ...chart.pie,
                sections: [
                    ...chart.pie.sections,
                    defaultSeries
                ]
            }
        });
    };

    const onDelete = index => {
        setChart({
            ...chart,
            pie: {
                ...chart.pie,
                sections: [
                    ...chart.pie.sections.slice(0, index),
                    ...chart.pie.sections.slice(index + 1)
                ]
            }
        });
    };

    const setSectionSeries = (index, series) => {
        setChart({
            ...chart,
            pie: {
                ...chart.pie,
                sections: [
                    ...chart.pie.sections.slice(0, index),
                    series,
                    ...chart.pie.sections.slice(index + 1)
                ]
            }
        });
    };

    const setSectionData = (index, data) => {
        setChart({
            ...chart,
            pie: {
                ...chart.pie,
                sections: [
                    ...chart.pie.sections.slice(0, index),
                    {
                        ...chart.pie.sections[index],
                        data: data
                    },
                    ...chart.pie.sections.slice(index + 1)
                ]
            }
        });
    };

    const renderSeries = (series, index) => {
        return (
            <DataSelector
                key={`series${index}`}
                dataFormat={dataFormat}
                axisTypes={[]}
                series={series}
                setSeries={s => setSectionSeries(index, s)}
                data={series.data}
                setData={data => setSectionData(index, data)}
                label
                wildcard
                onDelete={() => onDelete(index)}
            />
        );
    };
    const seriesList = chart.pie.sections.map(renderSeries);

    return (
        <div className='seriesCreator'>
            {seriesList}
            <Button variant='contained' color='primary' onClick={onAdd}>Add Data</Button>
        </div>
    );
}

export default TimeSeriesCreator;
