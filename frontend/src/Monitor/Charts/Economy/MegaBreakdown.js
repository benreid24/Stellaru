import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import ComposedChart from '../ComposedChart';
import {selectNested, findKeysOverSeries, renderArea, renderLine} from '../Util';
import {getResourceName} from './Util';
import {registerChart} from '../../ChartRegistry';
import Chart from '../Chart';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function MegaBreakdown(props) {
    const name = props.name ? props.name : 'MegaBreakdown';
    const classes = useStyles();
    const data = props.data;

    const [resourceType, setResourceType] = useState('');
    useEffect(() => {
        if (resourceType)
            window.localStorage.setItem(`${name}-resource`, JSON.stringify(resourceType));
    }, [resourceType, name]);
    const onResourceTypeChange = event => setResourceType(event.target.value);

    const resourceTypes = [...new Set([
        ...findKeysOverSeries(data, 'economy/income'),
        ...findKeysOverSeries(data, 'economy/spending')
    ])];
    const renderResourceType = type => <MenuItem key={type} value={type}>{getResourceName(type)}</MenuItem>;
    const renderedResourceTypes = resourceTypes.map(renderResourceType);

    const renderIncome = (series, labelColors) => {
        return renderArea(series, labelColors[series.label], 'income');
    };
    const renderSpending = (series, labelColors) => {
        return renderArea(series, labelColors[series.label], 'spendng');
    };
    const renderNet = (series, labelColors) => {
        return renderLine(series, labelColors[series.label]);
    };
    const renderSeries = (series, labelColor) => series.renderer(series, labelColor);

    const incomeKeys = findKeysOverSeries(data, `economy/income/${resourceType}/breakdown`);
    const incomeSeries = incomeKeys.map(key => {
        return {
            label: `${key} Income`,
            selector: snap => selectNested(`economy/income/${resourceType}/breakdown/${key}/total`, snap),
            renderer: renderIncome
        };
    });
    const spendingKeys = findKeysOverSeries(data, `economy/spending/${resourceType}/breakdown`);
    const spendingSeries = spendingKeys.map(key => {
        return {
            label: `${key} Spending`,
            selector: snap => -1 * selectNested(`economy/spending/${resourceType}/breakdown/${key}/total`, snap),
            renderer: renderSpending
        };
    });
    const series = [
        ...incomeSeries,
        ...spendingSeries,
        {
            label: 'Net Income',
            selector: snap => selectNested(`economy/net_income/${resourceType}`, snap),
            renderer: renderNet
        }
    ];

    useEffect(() => {
        const savedResource = window.localStorage.getItem(`${name}-resource`);
        if (savedResource !== null) {
            const resource = JSON.parse(savedResource);
            if (!resourceType && resourceTypes.includes(resource)) {
                setResourceType(resource);
            }
        }
    }, [data, resourceType, resourceTypes, name]);

    return (
        <Chart title={`${getResourceName(resourceType)} Production Overview`} titleColor='#ded140'>
            <div className='fancyChartForm'>
                <div className='fancyChartInner'>
                    <FormControl className={classes.formControl}>
                        <Select value={resourceType} onChange={onResourceTypeChange}>
                            {renderedResourceTypes}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className='fancyBreakdownChart'>
                <ComposedChart
                    name={name}
                    data={data}
                    series={series}
                    allowIsolation={true}
                    seriesRenderer={renderSeries}
                />
            </div>
        </Chart>
    );
}

registerChart(
    'Resource Production Overview',
    'Shows a breakdown of spending and income for an individual resource, overlayed with net income',
    MegaBreakdown
);

export default MegaBreakdown;