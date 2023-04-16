import {FilterState, Group, GroupState} from './Context';

export type GroupTimeseries = {
    group: Group;
    timeseries: {
        label: string;
        selector: (data: any) => number;
    }
};

export type GroupReducer = (currentValue: number, nextValue: number, memberCount: number) => number;

const getFederationMembers: (snap: any, fid: number) => number[] = (snap, fid) => {
    const feds = (snap['federations'] ?? []) as any[];
    for (let i = 0; i < feds.length; i += 1) {
        if (feds[i]['id'] === fid) {
            return feds[i]['members'].map(Number);
        }
    }
    return [];
}

const empireNotFiltered: (snap: any, eid: number, filter: FilterState) => boolean = (snap, eid, filter) => {
    const t = snap['leaderboard']?.['empire_summaries']?.[eid]?.['type'];
    if (t === 'player') {
        return filter.showPlayers;
    }
    if (t === 'regular_ai') {
        return filter.showRegularAi;
    }
    if (t === 'fallen_empire') {
        return filter.showFallenEmpires;
    }
    return false;
}

const filterEmpires: (snap: any, group: Group, filter: FilterState) => number[] = (
    snap, group, filter
) => {
    return (group.isFederation ?
                getFederationMembers(snap, group.id)
                : group.members).filter(
                    eid => empireNotFiltered(snap, eid, filter)
                );
}

export const findEmpireName = (eid: number, data: any[]) => {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        const summaries = data[i]?.['leaderboard']?.['empire_summaries'] ?? {};
        if (eid in summaries) {
            return summaries[eid]['name'];
        }
    }
    return 'Unknown Empire';
}

export const findPlayerName = (eid: number, data: any[]) => {
    for (const datum of data) {
        const summaries = datum?.['leaderboard']?.['empire_summaries'];
        if (eid in summaries) {
            return summaries[eid]['player_name'];
        }
    }
    return 'Unknown Player';
}

export const sumReducer: GroupReducer = (currentValue: number, nextValue: number) => {
    return currentValue + nextValue;
}

export const maxValReducer: GroupReducer = (currentValue: number, nextValue: number) => {
    return currentValue > nextValue ? currentValue : nextValue;
}

export const avgReducer: GroupReducer = (currentValue: number, nextValue: number, memberCount: number) => {
    return currentValue + nextValue / memberCount;
}

export const getTimeseries = (
    data: any[],
    groupState: GroupState,
    filterState: FilterState,
    empireSelector: (snap: any, empireId: number) => number,
    reducer: GroupReducer = sumReducer
): GroupTimeseries[] => {
    const groups = groupState.groups;
    return Object.keys(groups).map(Number).map(gid => {
        const g = groups[gid];

        const fm = data ? filterEmpires(data[data.length-1], g, filterState) : g.members;
        if (fm.length === 0) {
            return null;
        }

        return {
            group: g,
            timeseries: {
                label: g.name,
                selector: snap => {
                    const members = filterEmpires(snap, g, filterState);
                    return members.reduce((value: number, eid: number) => {
                        return reducer(value, empireSelector(snap, eid), members.length);
                    }, 0);
                }
            }
        } as GroupTimeseries;
    }).filter(ts => ts !== null) as GroupTimeseries[];
}
