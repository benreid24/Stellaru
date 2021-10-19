import React from 'react';
import {findKeysOverSeries} from 'Monitor/Charts/Util';
import {objectKeys} from 'Helpers';
import {findEmpireName} from './Selectors';

const CUSTOM_KEY = 'leaderboard.custom_groups';

export enum GroupType {
    Empires,
    Federations,
    FederationsWithEmpires,
    Custom
}

export type Group = {
    id: number; // federation id or generated id for custom groups
    name: string;
    members: number[];
    isFederation: boolean;
}

export type GroupState = {
    groupType: GroupType;
    groups: Record<number, Group>;
}

export type ConnectedPlayer = {
    playerName: string;
    playerEmpire: number;
}

export type FilterState = {
    showPlayers: boolean;
    showRegularAi: boolean;
    showFallenEmpires: boolean;
}

export type LeaderboardContextValue = {
    groupState: GroupState;
    connectedPlayers: ConnectedPlayer[];
    filterState: FilterState;
    onPlayerConnect: (player: ConnectedPlayer) => void;
    onPlayerDisconnect: (player: ConnectedPlayer) => void;
    setGroupingType: (groupType: GroupType) => void;
    createGroup: (name: string) => void;
    addEmpireToGroup: (groupId: number, empireId: number) => void;
    removeEmpireFromGroup: (groupId: number, empireId: number) => void;
    setGroupLabel: (groupId: number, label: string) => void;
    removeGroup: (groupId: number) => void;
    setFilterPlayers: (showPlayers: boolean) => void;
    setFilterRegularAi: (showRegularAi: boolean) => void;
    setFilterFallenEmpires: (showFallenEmpires: boolean) => void;
}

type LeaderboardContextProviderProps = {
    data: any[]; // TODO - we may want to type this
}

export const LeaderboardContext = React.createContext<LeaderboardContextValue | null>(null);

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

const findFederations = (data: any[]): number[] => {
    const fids = data.reduce((fids, snap) => {
        const feds = snap['federations'] ? snap['federations'] as any[] : [];
        feds.forEach(fed => fids[fed['id']] = true);
        return fids;
    }, {});
    return objectKeys(fids).map(Number);
}

const empiresToGroups = (data: any[], eids: number[]): Group[] => {
    return eids.map(eid => {
        return {
            id: eid,
            name: findEmpireName(eid, data),
            members: [eid],
            isFederation: false
        } as Group;
    });
}

const getEmpiresNotInFederation = (data: any[]): number[] => {
    if (data.length === 0) return [];
    
    const snap = data[data.length-1];
    const feds = snap['federations'] ? snap['federations'] as any[] : [];
    const eids = findKeysOverSeries([snap], 'leaderboard/empire_summaries').map(Number);

    const notInFed = (eid: number): boolean => {
        for (let i = 0; i < feds.length; i += 1) {
            const members = (feds[i]['members'] as string[]).map(Number);
            if (members.indexOf(eid) >= 0) return false;
        }
        return true;
    }
    return eids.filter(notInFed);
}

const updatedGroups: (gtype: GroupType, data: any[]) => Group[] = (
    gtype, data
) => {
    if (gtype === GroupType.Custom) {
        const lg = localStorage.getItem(CUSTOM_KEY);
        return lg ? JSON.parse(lg) as Group[] : [];
    }
    if (gtype === GroupType.Federations || gtype === GroupType.FederationsWithEmpires) {
        const fids = findFederations(data);
        let groups = fids.map(fid => {
            return {
                id: fid,
                name: findFederationName(fid, data),
                members: [], // members are determined at extraction time
                isFederation: true
            } as Group;
        });
        if (gtype === GroupType.FederationsWithEmpires) {
            // we only chart empires not in a federation at present. We may want to make this
            // behavior more sophisticated going forward
            const eids = getEmpiresNotInFederation(data);
            const empireGroups = empiresToGroups(data, eids).map(group => {
                return {
                    ...group,
                    label: `${group.name} (Empire)`
                };
            });
            groups = [...groups, ...empireGroups];
        }
        return groups;
    }
    const eids = findKeysOverSeries(data, 'leaderboard/empire_summaries').map(Number);
    return empiresToGroups(data, eids);
};

export const LeaderboardContextProvider: React.FC<LeaderboardContextProviderProps> = (props) => {
    const {children, data} = props;
    const GROUP_TYPE_KEY = 'leaderboard.group_type';

    const [groupState, setGroupState] = React.useState<GroupState>(() => {
        const stored = localStorage.getItem(GROUP_TYPE_KEY);
        const gt = stored ? JSON.parse(stored) as GroupType : GroupType.Empires;
        const lg = localStorage.getItem(CUSTOM_KEY);
        const gs = gt === GroupType.Custom && lg ? JSON.parse(lg) as Group[] : [];
        return {
            groupType: gt,
            groups: gs
        };
    });

    const [connectedPlayers, setConnectedPlayers] = React.useState<ConnectedPlayer[]>([]);

    const [filterState, setFilterState] = React.useState<FilterState>({
        showPlayers: true,
        showRegularAi: true,
        showFallenEmpires: false
    });

    const onPlayerConnect = React.useCallback((player: ConnectedPlayer) => {
        setConnectedPlayers([...connectedPlayers, player]);
    }, [connectedPlayers, setConnectedPlayers]);

    const onPlayerDisconnect = React.useCallback((player: ConnectedPlayer) => {
        setConnectedPlayers(connectedPlayers.filter(p => p.playerEmpire !== player.playerEmpire));
    }, [connectedPlayers, setConnectedPlayers]);

    const setGroupingType = React.useCallback((groupType: GroupType) => {
        setGroupState({groups: updatedGroups(groupType, data), groupType: groupType});
    }, [setGroupState, data]);

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
                            ],
                            isFederation: group.isFederation
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
                        members: group.members.filter(eid => eid !== empireId),
                        isFederation: group.isFederation
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
                        members: [],
                        isFederation: false
                    }
                }
            });
            return gid;
        }
        return -1;
    }, [groupState, setGroupState]);

    const setGroupLabel = React.useCallback((groupId: number, label: string) => {
        if (groupState.groupType === GroupType.Custom) {
            const group = groupState.groups[groupId];
            if (group) {
                setGroupState({
                    groupType: groupState.groupType,
                    groups: {
                        ...groupState.groups,
                        [groupId]: {
                            ...group,
                            name: label
                        }
                    }
                });
            }
        }
    }, [groupState, setGroupState]);

    const removeGroup = React.useCallback((groupId: number) => {
        if (groupState.groupType === GroupType.Custom) {
            const groups = groupState.groups
            delete groups[groupId];
            setGroupState({
                groupType: groupState.groupType,
                groups: groups
            });
        }
    }, [groupState, setGroupState]);

    const setFilterPlayers = React.useCallback((show: boolean) => {
        setFilterState(fs => {
            return {
                ...fs,
                showPlayers: show
            };
        });
    }, [setFilterState]);

    const setFilterRegularAi = React.useCallback((show: boolean) => {
        setFilterState(fs => {
            return {
                ...fs,
                showRegularAi: show
            };
        });
    }, [setFilterState]);

    const setFilterFallenEmpires = React.useCallback((show: boolean) => {
        setFilterState(fs => {
            return {
                ...fs,
                showFallenEmpires: show
            };
        });
    }, [setFilterState]);

    React.useEffect(() => {
        if (groupState.groupType !== GroupType.Custom) {
            setGroupState(g => {
                return {
                    groupType: g.groupType,
                    groups: updatedGroups(g.groupType, data)
                };
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    React.useEffect(() => {
        localStorage.setItem(GROUP_TYPE_KEY, JSON.stringify(groupState.groupType));
        if (groupState.groupType === GroupType.Custom) {
            localStorage.setItem(CUSTOM_KEY, JSON.stringify(groupState.groups));
        }
    }, [groupState]);

    const contextValue = React.useMemo<LeaderboardContextValue>(
        () => ({
            groupState,
            connectedPlayers,
            filterState,
            onPlayerConnect,
            onPlayerDisconnect,
            setGroupingType,
            addEmpireToGroup,
            removeEmpireFromGroup,
            createGroup,
            setGroupLabel,
            removeGroup,
            setFilterPlayers,
            setFilterRegularAi,
            setFilterFallenEmpires
        }),
        [
            groupState,
            connectedPlayers,
            filterState,
            onPlayerConnect,
            onPlayerDisconnect,
            setGroupingType,
            addEmpireToGroup,
            removeEmpireFromGroup,
            createGroup,
            setGroupLabel,
            removeGroup,
            setFilterPlayers,
            setFilterRegularAi,
            setFilterFallenEmpires
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
