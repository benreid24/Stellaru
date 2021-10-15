import React from 'react';
import {GroupType, useLeaderboardContext} from './Context';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

import './Leaderboard.css';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: 0,
        marginLeft: '8px',
        minWidth: 120,
        display: 'flex',
        flexDirection: 'row'
    },
    selectEmpty: {
        marginTop: 0,
    },
    button: {
        padding: 0,
        margin: 0,
        maxHeight: '10px'
    }
}));

const groupTypeToText = (groupType: GroupType) => {
    switch (groupType) {
        case GroupType.Empires:
            return "Empires";
        case GroupType.Federations:
            return "Federations Only";
        case GroupType.FederationsWithEmpires:
            return "Federations & Independant Empires";
        case GroupType.Custom:
            return "Custom Groups";
        default:
            return "Error";
    }
}

type GroupEditorProps = {
    open: boolean;
    onRequestClose: () => void;
    data: any[];
}

const GroupEditor: React.FC<GroupEditorProps> = ({open, onRequestClose}) => {

    return (
        <div className="groupEditorOverlay" style={{visibility: open ? 'visible' : 'hidden'}}>
            <div className='groupEditorModal'>
                <Button variant='contained' onClick={onRequestClose}>Close</Button>
            </div>
        </div>
    );
}

type EditGroupButtonProps = {
    onClick: () => void;
}

const EditGroupButton: React.FC<EditGroupButtonProps> = ({onClick}) => {
    return (
        <div className='editGroupButton' onClick={onClick}>
            <p className='editGroupButtonText'>
                Edit Groups
            </p>
        </div>
    )
}

type GroupControlsProps = {
    data: any[];
}

const GroupControls: React.FC<GroupControlsProps> = ({data}) => {
    const classes = useStyles();

    const {groupState, setGroupingType} = useLeaderboardContext();
    const [editorOpen, setEditorOpen] = React.useState<boolean>(false);

    const onGroupChange = (event: any) => {
        setGroupingType(event.target.value);
    };

    return (
        <div className="groupControls">
            <p className="groupText">Grouping by:</p>
            <FormControl className={classes.formControl}>
                <Select value={groupState.groupType} onChange={onGroupChange} label='Group Type'>
                <MenuItem value={GroupType.Empires}>{groupTypeToText(GroupType.Empires)}</MenuItem>
                <MenuItem value={GroupType.Federations}>{groupTypeToText(GroupType.Federations)}</MenuItem>
                <MenuItem value={GroupType.FederationsWithEmpires}>{groupTypeToText(GroupType.FederationsWithEmpires)}</MenuItem>
                <MenuItem value={GroupType.Custom}>{groupTypeToText(GroupType.Custom)}</MenuItem>
                </Select>
                {groupState.groupType === GroupType.Custom && 
                    <EditGroupButton onClick={() => setEditorOpen(true)}/>
                }
            </FormControl>
            <GroupEditor open={editorOpen} onRequestClose={() => setEditorOpen(false)} data={data}/>
        </div>
    );
}

export type StatusBoardProps = {
    data: any[];
}

export const StatusBoard: React.FC<StatusBoardProps> = ({data}) => {
    return (
        <div className='statusBoard'>
            <GroupControls data={data}/>
        </div>
    );
}
