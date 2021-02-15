import React, {useState} from 'react';

import CustomChartBuilder from 'Monitor/Visualizations/Custom/CustomChartBuilder';
import {getAllCharts, chartExists} from 'Monitor/Visualizations/Custom/CustomChartRepository';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    select: {
        minWidth: 200,
        marginBottom: theme.spacing(2),
    }
}));

function ChartBuilder(props) {
    const classes = useStyles();
    const data = props.data;

    const [loadedChart, setLoadedChart] = useState(null);
    const [currentChart, setCurrentChart] = useState('');
    const onChartChange = event => {
        setCurrentChart(event.target.value);
        setLoadedChart(event.target.value);
    };
    
    const [allCharts, setAllCharts] = useState(getAllCharts());
    const refresh = name => {
        setAllCharts(getAllCharts());
        if (name && chartExists(name))
            setCurrentChart(name);
        else
            setCurrentChart('');
    };

    const renderItem = chart => {
        return (
            <MenuItem key={chart.name} value={chart.name}>{chart.name}</MenuItem>
        );
    };
    const renderedCharts = allCharts.map(renderItem);

    return (
        <div className='monitorTab'>
            <div className='customChartLoadInputArea'>
                <p className='customChartLoadLabel'>Load Chart</p>
                <Select onChange={onChartChange} value={currentChart} className={classes.select}>
                    {renderedCharts}
                </Select>
            </div>
            <CustomChartBuilder chart={loadedChart} data={data} refresh={refresh}/>
        </div>
    );
}

export default ChartBuilder;
