import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import StackedAreaChart from '../StackedAreaChart';
import {selectNested} from '../Util';

const DataTypes = Object.freeze({'Income': 'Income', 'Spending': 'Spending'});
const DataKeys = Object.freeze({[DataTypes.Income]: 'income', [DataTypes.Spending]: 'spending'});
const ResourceNames = Object.freeze({
    'society_research': 'Society Research',
    'energy': 'Energy Credit',
    'minerals': 'Mineral',
    'food': 'Food',
    'physics_research': 'Physics Research',
    'engineering_research': 'Engineering Research',
    'influence': 'Influence',
    'unity': 'Unity',
    'alloys': 'Alloys',
    'consumer_goods': 'Consumer Goods',
    'volatile_motes': 'Volatile Motes',
    'rare_crystals': 'Rare Crystals',
    'exotic_gases': 'Exotic Gases',
    'sr_dark_matter': 'Dark Matter'
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function FancyBreakdown(props) {
    const classes = useStyles();
    const data = props.data;
    const height = props.height;

    const [dataType, setDataType] = useState(DataTypes.Income);
    const [resourceType, setResourceType] = useState('Energy Credit');
    const onDataTypeChange = event => setDataType(event.target.value);
    const onResourceTypeChange = event => setResourceType(event.target.value);

    const [resourceTypes, setResourceTypes] = useState(['Energy Credit']);
    useEffect(() => {
        let types = {};
        [DataTypes.Income, DataTypes.Spending].forEach(dtype => {
            data.forEach(snap => {
                for (let resource in snap['economy'][DataKeys[dtype]]) {
                    if (!(resource in types)) {
                        types[resource] = true;
                    }
                }
            })
        });
        setResourceTypes(Object.entries(types).map(([key, _]) => ResourceNames[key]));
    }, [data]);

    const renderResourceType = type => <MenuItem key={type} value={type}>{type}</MenuItem>;
    const renderedResourceTypes = resourceTypes.map(type => renderResourceType(type));

    return (
        <div className='chart'>
            <div className='chartForm'>
                <FormControl className={classes.formControl}>
                    <Select value={resourceType} onChange={onResourceTypeChange}>
                        {renderedResourceTypes}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select value={dataType} onChange={onDataTypeChange}>
                        <MenuItem value={DataTypes.Income}>Income</MenuItem>
                        <MenuItem value={DataTypes.Spending}>Spending</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <StackedAreaChart
                data={data}
                height={height}
                title={`${resourceType} ${dataType} Breakdown`}
                titleColor='#ded140'
                showLabels={false}
                padding={{left: 40, top: 30, right: 30, bottom: 50}}
                areas={[
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
    );
}

export default FancyBreakdown;
