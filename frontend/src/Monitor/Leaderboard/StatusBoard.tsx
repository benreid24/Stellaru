import React from 'react';
import {ConnectedPlayer, FilterState, Group, GroupType, useLeaderboardContext} from './Context';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import {makeStyles} from '@material-ui/core/styles';
import {findEmpireName, findPlayerName} from './Selectors';

import './Leaderboard.css';
import { getDataColors } from 'Monitor/Charts/Util';
import { Grid, ListItemText, Typography } from '@material-ui/core';

// Like `Object.keys` but typed. TODO: move to reusable commons?
type KeyValue<T extends Record<string, unknown>, K extends keyof T = keyof T> = [K, T[K]]
export const recordEntries = <T extends Record<string, unknown>>(o: T) => Object.entries(o) as KeyValue<T>[];
export const recordKeys = <T extends Record<string, unknown>>(o: T) => Object.keys(o) as (keyof T)[];
export const recordValues = <T extends Record<string, unknown>>(o: T) => Object.values(o) as T[keyof T][];

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

const filterToText = (filterKey: keyof FilterState) => {
    switch (filterKey) {
        case 'showPlayers':
            return "Players";
        case 'showRegularAi':
            return "AIs";
        case 'showFallenEmpires':
            return "Fallen Empires";
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

    const eids = Object.entries(data?.[data?.length-1]?.['leaderboard']?.['empire_summaries'] ?? [])
    const empireList = eids.map(([eid, empire]) => ({
        id: Number(eid),
        label: `${(empire as any)?.name} (${(empire as any)?.type})`
    } as LabeledEmpire));

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
        <div className="groupEditorOverlay" style={{visibility: open ? 'visible' : 'hidden'}}>
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
    const {groupState, setGroupingType} = useLeaderboardContext();
    const [editorOpen, setEditorOpen] = React.useState<boolean>(false);

    const onGroupChange = (event: any) => {
        setGroupingType(event.target.value);
    };

    return (
        <Grid container wrap='nowrap' alignItems='center'>
            <Typography className="groupText">Group by:&nbsp;</Typography>
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
            <GroupEditor open={editorOpen} onRequestClose={() => setEditorOpen(false)} data={data}/>
        </Grid>
    );
}

const FilterControls: React.FC = (props) => {
    const {
        filterState,
        setFilterPlayers,
        setFilterRegularAi,
        setFilterFallenEmpires
    } = useLeaderboardContext();

    const onFilterChange = (event: any) => {
        const selected = event.target.value as (keyof FilterState)[]  // Weird that <Select> is not properly typed.
        if(filterState.showPlayers !== selected.includes('showPlayers')) setFilterPlayers(!filterState.showPlayers)
        if(filterState.showRegularAi !== selected.includes('showRegularAi')) setFilterRegularAi(!filterState.showRegularAi)
        if(filterState.showFallenEmpires !== selected.includes('showFallenEmpires')) setFilterFallenEmpires(!filterState.showFallenEmpires)
    }

    return (
        <Grid container wrap='nowrap' alignItems='center'>
            <Typography className="groupText">Filter:&nbsp;</Typography>
            <TextField
                select
                value={recordEntries(filterState).filter(([,checked]) => checked).map(([key]) => key)}
                onChange={onFilterChange}
                SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (selected as (keyof FilterState)[]).map(filterToText).join(', '),
                }}
            >
                {recordEntries(filterState).map(([filter, checked]) => (
                    <MenuItem dense key={filter} value={filter}>
                        <Checkbox size='small' checked={checked} />
                        <ListItemText primary={filterToText(filter)} />
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    );
}

type PlayerListProps = {
    data: any[];
}

const PlayerList: React.FC<PlayerListProps> = ({data}) => {
    const {connectedPlayers} = useLeaderboardContext();

    const pl = Object.values(connectedPlayers);
    const playerIds = pl.map(player => player.id);
    const [initialColors, initialHues] = getDataColors(playerIds);
    const [playerColors, setPlayerColors] = React.useState<Record<string, string>>(initialColors);
    const labelHues = React.useState<number[]>(initialHues)[0];

    React.useEffect(() => {
        const pl = Object.values(connectedPlayers);
        const pids = pl.map(player => player.id);
        setPlayerColors(getDataColors(pids, labelHues)[0]);
    }, [data, connectedPlayers, labelHues, setPlayerColors]);

    const renderPlayers = React.useCallback(
        (playerList: ConnectedPlayer[]) => playerList.map(player => {
            return (
                <p className='connectedPlayer' key={player.id} style={{color: playerColors[player.id]}}>
                    {findPlayerName(player.playerEmpire, data)}
                    <span className='connectedPlayerEmpire'>
                        ({findEmpireName(player.playerEmpire, data)})
                    </span>
                </p>
            )
        }
    ), [data, playerColors]);

    const [renderedPlayers, setRenderedPlayers] = React.useState<React.ReactElement[]>(renderPlayers(pl));
    React.useEffect(() => {
        setRenderedPlayers(renderPlayers(Object.values(connectedPlayers)));
    }, [connectedPlayers, setRenderedPlayers, renderPlayers]);

    return (
        <div className='playerListArea'>
            <p className='groupText'>Currently Watching:</p>
            <div className='playerList'>
                {renderedPlayers}
            </div>
        </div>
    );
}

export type StatusBoardProps = {
    data: any[];
}

export const StatusBoard: React.FC<StatusBoardProps> = ({data}) => {
    return (
        <Grid container className='statusBoard' wrap='nowrap' spacing={2}>
            <Grid item>
                <GroupControls data={data} />
            </Grid>
            <Grid item>
                <FilterControls />
            </Grid>
            <Grid item xs />
            <Grid item>
                <PlayerList data={data}/>
            </Grid>
        </Grid>
    );
}
