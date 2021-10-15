import React from 'react';
import {findKeysOverSeries, findValuesOverSeries} from 'Monitor/Charts/Util';

export enum GroupType {
    Empires,
    Federations,
    Custom
}

export type Group = {
    id: number; // federation id or generated id for custom groups
    name: string;
    members: number[];
}

export type GroupState = {
    groupType: GroupType;
    groups: Group[];
}

export type ConnectedPlayer = {
    playerName: string;
    playerEmpire: number;
}

export type LeaderboardContextValue = {
    groupState: GroupState;
    connectedPlayers: ConnectedPlayer[];
    onPlayerConnect: (player: ConnectedPlayer) => void;
    onPlayerDisconnect: (player: ConnectedPlayer) => void;
    setGroupingType: (groupType: GroupType) => void;
    createGroup: (name: string) => number;
    addEmpireToGroup: (groupId: number, empireId: number) => void;
    removeEmpireFromGroup: (groupId: number, empireId: number) => void;
}

type LeaderboardContextProviderProps = {
    data: any[]; // TODO - we may want to type this
}

export const LeaderboardContext = React.createContext<LeaderboardContextValue | null>(null);

const findEmpireName = (eid: number, data: any[]) => {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        const summaries = data[i]['leaderboard']['empire_summaries'];
        if (eid in summaries) {
            return summaries[eid]['name'];
        }
    }
    return 'Unknown Empire';
}

const findFederationName = (fid: number, data: any[]) => {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        const feds = data[i]['federations'];
        for (let j = 0; j < feds.length; j += 1) {
            if (feds[j]['id'] === fid) {
                return feds[j]['name'] as string;
            }
        }
    }
    return 'Unknown Federation';
}

const updatedGroups: (groupState: GroupState, gtype: GroupType, data: any[]) => Group[] = (
    groupState, gtype, data
) => {
    const CUSTOM_KEY = 'leaderboard.custom_groups';
    if (groupState.groupType === GroupType.Custom) {
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(groupState.groups));
    }

    if (gtype === GroupType.Custom) {
        const lg = localStorage.getItem(CUSTOM_KEY);
        return lg ? JSON.parse(lg) as Group[] : [];
    }
    if (gtype === GroupType.Federations) {
        const fids = findValuesOverSeries(data, 'federations/id').map(Number);
        return fids.map(fid => {
            return {
                id: fid,
                name: findFederationName(fid, data),
                members: [] // members are determined at extraction time
            } as Group;
        });
    }
    const eids = findKeysOverSeries(data, 'leaderboard/empire_summaries').map(Number);
    return eids.map(eid => {return {id: eid, name: findEmpireName(eid, data), members: [eid]} as Group;});
};

export const LeaderboardContextProvider: React.FC<LeaderboardContextProviderProps> = (props) => {
    const {children, data} = props;

    const [groupState, setGroupState] = React.useState<GroupState>({
        groupType: GroupType.Empires,
        groups: []
    });

    const [connectedPlayers, setConnectedPlayers] = React.useState<ConnectedPlayer[]>([]);

    const onPlayerConnect = React.useCallback((player: ConnectedPlayer) => {
        setConnectedPlayers([...connectedPlayers, player]);
    }, [connectedPlayers, setConnectedPlayers]);

    const onPlayerDisconnect = React.useCallback((player: ConnectedPlayer) => {
        setConnectedPlayers(connectedPlayers.filter(p => p.playerEmpire !== player.playerEmpire));
    }, [connectedPlayers, setConnectedPlayers]);

    const setGroupingType = React.useCallback((groupType: GroupType) => {
        setGroupState({groups: updatedGroups(groupState, groupType, data), groupType: groupType});
    }, [groupState, setGroupState, data]);

    const addEmpireToGroup = React.useCallback((groupId: number, empireId: number) => {
        const group = groupState.groups[groupId];
        if (group && groupState.groupType === GroupType.Custom) {
            if (group.members.indexOf(empireId) < 0) {
                setGroupState({
                    ...groupState,
                    groups: {
                        ...groupState.groups,
                        [groupId]: {
                            id: group.id,
                            name: group.name,
                            members: [
                                ...group.members,
                                empireId
                            ]
                        }
                    }
                });
            }
        }
    }, [groupState, setGroupState]);

    const removeEmpireFromGroup = React.useCallback((groupId: number, empireId: number) => {
        const group = groupState.groups[groupId];
        if (group && groupState.groupType === GroupType.Custom) {
            setGroupState({
                ...groupState,
                groups: {
                    ...groupState.groups,
                    [groupId]: {
                        id: group.id,
                        name: group.name,
                        members: group.members.filter(eid => eid !== empireId)
                    }
                }
            });
        }
    }, [groupState, setGroupState]);

    const createGroup = React.useCallback((name: string) => {
        if (groupState.groupType === GroupType.Custom) {
            let gid = 1234;
            do {
                gid = Math.round(Math.random() * 10000000 + 1000);
            } while (gid in groupState.groups);
            setGroupState({
                ...groupState,
                groups: {
                    ...groupState.groups,
                    [gid]: {
                        id: gid,
                        name: name,
                        members: []
                    }
                }
            });
            return gid;
        }
        return -1;
    }, [groupState, setGroupState]);

    React.useEffect(() => {
        setGroupState(g => {
            return {
                groupType: g.groupType,
                groups: updatedGroups(g, g.groupType, data)
            };
        });
    }, [data]);

    const contextValue = React.useMemo<LeaderboardContextValue>(
        () => ({
            groupState,
            connectedPlayers,
            onPlayerConnect,
            onPlayerDisconnect,
            setGroupingType,
            addEmpireToGroup,
            removeEmpireFromGroup,
            createGroup
        }),
        [
            groupState,
            connectedPlayers,
            onPlayerConnect,
            onPlayerDisconnect,
            setGroupingType,
            addEmpireToGroup,
            removeEmpireFromGroup,
            createGroup
        ]
    );

    return <LeaderboardContext.Provider value={contextValue}>{children}</LeaderboardContext.Provider>;
}

export const useLeaderboardContext = () => {
    const context = React.useContext(LeaderboardContext);
    if (!context) {
        throw new Error('useLeaderboardContext() must be used within a LeaderboardContextProvider');
    }
    return context;
}
