import React from 'react';
import DataSelector from './DataSelector';
import {getSeriesKeyBreakdown} from './CustomChartRepository';

import Button from '@material-ui/core/Button';

function TimeSeriesCreator(props) {
    const data = props.data;
    const chart = props.chart;
    const setChart = props.setChart;
    const dataFormat = getSeriesKeyBreakdown(data);

    const xAxisOptions = [{value: 'x', name: 'x'}];
    const yAxisOptions = [{value: 'left', name: 'y (left)'}, {value: 'right', name: 'y (right)'}];
    const defaultSeries = {
        data: [],
        axis: 'left',
        type: 'line',
        label: '',
        stackId: 'none'
    };

    const setXData = data => {
        setChart({
            ...chart,
            timeseries: {
                ...chart.timeseries,
                x: data
            }
        });
    };

    const onAdd = () => {
        setChart({
            ...chart,
            timeseries: {
                ...chart.timeseries,
                y: [
                    ...chart.timeseries.y,
                    defaultSeries
                ]
            }
        });
    };

    const onDelete = index => {
        setChart({
            ...chart,
            timeseries: {
                ...chart.timeseries,
                y: [
                    ...chart.timeseries.y.slice(0, index),
                    ...chart.timeseries.y.slice(index + 1)
                ]
            }
        });
    };

    const setYSeries = (index, series) => {
        setChart({
            ...chart,
            timeseries: {
                ...chart.timeseries,
                y: [
                    ...chart.timeseries.y.slice(0, index),
                    series,
                    ...chart.timeseries.y.slice(index + 1)
                ]
            }
        });
    };

    const setYData = (index, data) => {
        setChart({
            ...chart,
            timeseries: {
                ...chart.timeseries,
                y: [
                    ...chart.timeseries.y.slice(0, index),
                    {
                        ...chart.timeseries.y[index],
                        data: data
                    },
                    ...chart.timeseries.y.slice(index + 1)
                ]
            }
        });
    };

    const renderSeries = (series, index) => {
        return (
            <DataSelector
                key={`series${index}`}
                dataFormat={dataFormat}
                series={series}
                setSeries={s => setYSeries(index, s)}
                data={series.data}
                setData={data => setYData(index, data)}
                axisTypes={yAxisOptions}
                label
                timeseries
                wildcard
                onDelete={() => onDelete(index)}
            />
        );
    };
    const seriesList = chart.timeseries.y.map(renderSeries);

    return (
        <div className='seriesCreator'>
            <DataSelector dataFormat={dataFormat} data={chart.timeseries.x} setData={setXData} axisTypes={xAxisOptions}/>
            {seriesList}
            <Button variant='contained' color='primary' onClick={onAdd}>Add Data</Button>
        </div>
    );
}

export default TimeSeriesCreator;
