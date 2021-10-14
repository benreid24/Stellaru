import React from 'react';

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
    groups: Record<number, Group>;
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

export const LeaderboardContextProvider: React.FC<LeaderboardContextProviderProps> = (props) => {
    const {children} = props;

    const [groupState, setGroupState] = React.useState<GroupState>({
        groupType: GroupType.Empires,
        groups: {}
    });

    const [connectedPlayers, setConnectedPlayers] = React.useState<ConnectedPlayer[]>([]);

    const onPlayerConnect = React.useCallback((player: ConnectedPlayer) => {
        setConnectedPlayers([...connectedPlayers, player]);
    }, [connectedPlayers, setConnectedPlayers]);

    const onPlayerDisconnect = React.useCallback((player: ConnectedPlayer) => {
        setConnectedPlayers(connectedPlayers.filter(p => p.playerEmpire !== player.playerEmpire));
    }, [connectedPlayers, setConnectedPlayers]);

    const setGroupingType = React.useCallback((groupType: GroupType) => {
        setGroupState({...groupState, groupType: groupType});
        if (groupType === GroupType.Federations) {
            // TODO - regenerate groups from federations in data
        }
    }, [groupState, setGroupState]);

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
