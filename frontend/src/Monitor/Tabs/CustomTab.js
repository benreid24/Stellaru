import React, {useState, useEffect} from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from '@material-ui/core/styles';

import {getChart, getAllCharts, getAddedCharts, clearAdded} from 'Monitor/Charts/ChartRegistry';
import {randomString} from 'Helpers';
import {translate} from 'Translator';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0.5),
        minWidth: 240,
        width: '100%'
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    }
}));

function ChartAdder(props) {
    const classes = useStyles();
    const added = props.charts.map(chart => chart.name);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    if (!visible) {
        return (
            <div className='chartAdderHidden' onMouseEnter={() => setVisible(true)}>
                <div className='chartAdderHiddenInner'>
                    <p className='chartAdderText'>{translate('Settings...')}</p>
                </div>
            </div>
        );
    }

    const allCharts = getAllCharts();
    const onAdd = (_, value) => {
        if (allCharts.includes(value)) {
            props.onAdd(value.name);
            setInputValue('');
            setValue(null);
        }
    };

    const renderItem = chart => {
        return (
            <Tooltip title={<p style={{fontSize: '150%'}}>{chart.description}</p>} placement='right'>
                <Typography noWrap>{chart.name}</Typography>
            </Tooltip>
        );
    };
    let chartCompare = (left, right) => {
        if (left.category === right.category) {
            if (left.name < right.name)
                return -1;
            if (right.name < left.name)
                return 1;
            return 0;
        }
        if (left.category < right.category)
            return -1;
        if (right.category < left.category)
            return 1;
        return 0;
    };

    return (    
        <div className='container-fluid' onMouseLeave={() => setVisible(false)}>
            <div className='row justify-content-start'>
                <div className='col-xl-3 col-lg-4 col-md-5 col-sm-6 col-xs-7 align-self-end'>
                    <FormControl className={classes.formControl}>
                        <Autocomplete
                            id='chartSelect'
                            options={allCharts.sort(chartCompare)}
                            groupBy={chart => chart.category}
                            getOptionLabel={chart => chart.name}
                            renderInput={(params) => <TextField {...params} label="Add Chart..." variant="outlined"/>}
                            renderOption={renderItem}
                            onChange={onAdd}
                            value={value}
                            inputValue={inputValue}
                            onInputChange={(_, value) => setInputValue(value)}
                        />
                    </FormControl>
                </div>
                {added.length > 0 && 
                    <div className='col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-5 align-self-center'>
                        <Button color='secondary' variant='contained' onClick={props.onClear}>{translate('Clear Dashboard')}</Button>
                    </div>
                }
            </div>
        </div>
    );   
}

function CustomTab(props) {
    const data = props.data;
    const [charts, setCharts] = useState([]);
    const [renderedCharts, setRenderedCharts] = useState([]);

    const newChart = name => {
        return {name: name, size: 32, height: 37, saveName: randomString(8)};
    };

    useEffect(() => {
        let newCharts = [];
        try {
            const saved = window.localStorage.getItem('stellaruCharts');
            if (saved !== null) {
                newCharts = JSON.parse(saved);
            }
        }
        catch (_) {
            newCharts = [];
        }
        const added = getAddedCharts();
        added.forEach(chart => newCharts.push(newChart(chart)));
        setCharts(newCharts);
        clearAdded();
    }, []);

    const onAdd = chart => {
        setCharts([...charts, newChart(chart)]);
    };
    const onClear = () => {
        setCharts([]);
    };

    useEffect(() => {
        const onDelete = chart => {
            setCharts(charts.reduce((keptCharts, cChart) => {
                if (cChart.saveName !== chart)
                    return [...keptCharts, cChart];
                return keptCharts;
            }, []));
        };
        const onResize = (chart, larger) => {
            setCharts(charts.reduce((newCharts, cChart) => {
                if (cChart.saveName === chart) {
                    cChart.size += larger ? 3 : -3;
                    if (cChart.size > 95)
                        cChart.size = 95;
                    if (cChart.size < 10)
                        cChart.size = 10;
                }
                return [...newCharts, cChart];
            }, []));
        };
        const onChangeHeight = (chart, taller) => {
            setCharts(charts.reduce((newCharts, cChart) => {
                if (cChart.saveName === chart) {
                    cChart.height += taller ? 1 : -1;
                    if (cChart.height > 95)
                        cChart.height = 95;
                    if (cChart.height < 10)
                        cChart.height = 10;
                }
                return [...newCharts, cChart];
            }, []));
        }
        const onMove = (chart, higher) => {
            const i = charts.findIndex(cChart => cChart.saveName === chart);
            if (i >= 0) {
                let newCharts = charts.slice();
                const newI = higher ? i - 1 : i + 1;
                if (newI >= 0 && newI < charts.length) {
                    [newCharts[i], newCharts[newI]] = [newCharts[newI], newCharts[i]];
                    setCharts(newCharts);
                }
            }
        };
        
        const makeOverlay = chart => {
            return {
                onDelete: () => onDelete(chart),
                onResize: larger => onResize(chart, larger),
                onHeight: taller => onChangeHeight(chart, taller),
                onMove: higher => onMove(chart, higher)
            };
        };

        if (charts.length === 0) {
            setRenderedCharts([]);
            return;
        }

        let rendered = [];
        let toRender = charts.slice();
        let currentRow = [];
        let rowWidth = 0;
        let rowHeight = charts[0].height;
        let rowCount = 0;
        const addRow = () => {
            rendered.push(
                <div key={rowCount} className='customRow' style={{height: `${rowHeight}vh`}}>
                    {currentRow}
                </div>
            );
            rowCount += 1;
            currentRow = [];
            rowWidth = 0;
            rowHeight = 0;
        };
        for (let i = 0; i < toRender.length; i += 1) {
            const chart = toRender[i];
            if (rowWidth + chart.size > 98) {
                addRow();
            }
            else {
                const fetched = getChart(chart.name);
                if (fetched === null) {
                    toRender.splice(i, 1);
                    continue;
                }
                const Chart = fetched.component;
                currentRow.push(
                    <div key={chart.saveName} className={`customColumn`} style={{width: `${chart.size}%`}}>
                        <Chart name={chart.saveName} data={data} overlay={makeOverlay(chart.saveName)}/>
                    </div>
                );
                if (chart.height > rowHeight) rowHeight = chart.height;
                rowWidth += chart.size;
            }
        }
        if (toRender.length !== charts.length)
            setCharts(toRender);
        if (currentRow.length > 0)
            addRow();
        setRenderedCharts(rendered);
    }, [charts, data]);

    useEffect(() => {
        window.localStorage.setItem('stellaruCharts', JSON.stringify(charts));
    }, [charts]);

    return (
        <div className='customTab'>
            <div className='customTabHeader'>
                <ChartAdder onAdd={onAdd} onClear={onClear} charts={charts}/>
            </div>
            <div className='customTabContent'>
                {renderedCharts.length === 0 && <div className='row chartRow justify-content-center'><div className='col-6'><p>{translate('Create a custom dashboard by adding charts')}</p></div></div>}
                {renderedCharts}
            </div>
        </div>
    );
}

export default CustomTab;
