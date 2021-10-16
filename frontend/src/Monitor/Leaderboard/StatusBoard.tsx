import React from 'react';
import {Group, GroupType, useLeaderboardContext} from './Context';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {findEmpireName} from './Selectors';

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
}));

const useStyles2 = makeStyles((theme) => ({
    selectEmpty: {
        marginTop: 0,
        minWidth: '40px',
        marginLeft: '4px'
    },
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

type ButtonProps = {
    onClick: () => void;
    text: string;
    color?: string;
    style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({onClick, text, color, style}) => {
    const css = style ? style : {};
    const finalCss = color ? {...css, backgroundColor: color} : css;
    return (
        <div className='editGroupButton' onClick={onClick} style={finalCss}>
            <p className='editGroupButtonText'>
                {text}
            </p>
        </div>
    );
}

type LabeledEmpire = {
    id: number;
    label: string;
}

type GroupRowProps = {
    data: any[];
    group: Group;
    empireList: LabeledEmpire[];
    addEmpireToGroup: (groupId: number, empireId: number) => void;
    removeEmpireFromGroup: (groupId: number, empireId: number) => void;
    setGroupLabel: (groupId: number, label: string) => void;
    removeGroup: (groupId: number) => void;
}

const GroupRow: React.FC<GroupRowProps> = ({
    data,
    group,
    empireList,
    addEmpireToGroup,
    removeEmpireFromGroup,
    removeGroup, 
    setGroupLabel
}) => {
    const classes = useStyles2();
    
    const renderedItems = empireList.map(e => <MenuItem value={e.id} key={e.id}>{e.label}</MenuItem>);

    const renderedEmpires = group.members.map(eid => (
        <p key={eid} className='groupEditorEmpire' onClick={() => removeEmpireFromGroup(group.id, eid)}>
            {findEmpireName(eid, data)}
        </p>
    ));

    return (
        <div className='groupEditorRow'>
            <div className='groupEditorMemberList'>
                <p className='groupEditorListTitle'>
                    Empire List
                    <span className='groupEditorListHint'>(Click to remove)</span>
                </p>
                {renderedEmpires}
            </div>
            <div className='groupEditorAddEmpireArea'>
                Add
                <Select
                    value={''} 
                    onChange={event => addEmpireToGroup(group.id, event.target.value as number)}
                    label='Add To Group'
                    className={classes.selectEmpty}
                    MenuProps={{
                        style: {zIndex: 20001}
                    }}
                >
                    {renderedItems}
                </Select>
            </div>
            <div className='groupEditorLabelArea'>
                Name
                <TextField
                    variant='standard'
                    value={group.name}
                    onChange={event => setGroupLabel(group.id, event.target.value)}
                />
            </div>
            <div className='groupEditorRemoveArea'>
                <Button onClick={() => removeGroup(group.id)} text='Delete Group' color='#bb3333'/>
            </div>
        </div>
    )
}

type GroupEditorProps = {
    open: boolean;
    onRequestClose: () => void;
    data: any[];
}

const GroupEditor: React.FC<GroupEditorProps> = ({open, onRequestClose, data}) => {
    const {
        groupState,
        createGroup,
        addEmpireToGroup,
        removeEmpireFromGroup,
        setGroupLabel,
        removeGroup
    } = useLeaderboardContext();

    const eids = data && data.length > 0 ? 
        Object.keys(data[data.length-1]['leaderboard']['empire_summaries']).map(Number)
        : [];
    const empireList = eids.map(eid => {
        const empire = data[data.length-1]['leaderboard']['empire_summaries'][eid];
        return {
            id: eid,
            label: `${empire['name']} (${empire['type']})`
        } as LabeledEmpire;
    });

    const renderedGroups = Object.values(groupState.groups).map(g => (
        <GroupRow
            data={data}
            key={g.id}
            group={g}
            empireList={empireList}
            addEmpireToGroup={addEmpireToGroup}
            removeEmpireFromGroup={removeEmpireFromGroup}
            setGroupLabel={setGroupLabel}
            removeGroup={removeGroup}
        />
    ));

    return (
        <div className="groupEditorOverlay" style={{visibility: open ? 'visible' : 'hidden'}} onClick={onRequestClose}>
            <div className='groupEditorModal'>
                <h2 className='groupEditorTitle'>Edit Custom Groups</h2>
                <Button
                    onClick={() => createGroup(`Group ${Object.keys(groupState.groups).length+1}`)}
                    text='Create Group'
                    color='#34dd34'
                    style={{width: '120px', marginLeft: '80%'}}
                />
                <div className='groupEditorGroupArea'>
                    {renderedGroups}
                </div>
                <Button
                    onClick={onRequestClose}
                    text='Close'
                    color='#dd3434'
                    style={{width: '64px', marginLeft: '50%', transform: 'translateX(-50%)', marginBottom: '12px'}}
                />
            </div>
        </div>
    );
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
                    <Button
                        onClick={() => setEditorOpen(true)}
                        text='Edit Groups'
                        style={{marginLeft: '8px', marginTop: '4px'}}
                    />
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
