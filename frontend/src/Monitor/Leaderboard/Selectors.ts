import {Group, GroupState} from './Context';

export type GroupTimeseries = {
    group: Group;
    timeseries: {
        label: string;
        selector: (data: any) => number;
    }
};

export type GroupReducer = (currentValue: number, nextValue: number, memberCount: number) => number;

const getFederationMembers: (snap: any, fid: number) => number[] = (snap, fid) => {
    const feds = snap['federations'] as any[];
    for (let i = 0; i < feds.length; i += 1) {
        if (feds[i]['id'] === fid) {
            return feds[i]['members'].map(Number);
        }
    }
    return [];
}

export const findEmpireName = (eid: number, data: any[]) => {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        const summaries = data[i]['leaderboard']['empire_summaries'];
        if (eid in summaries) {
            return summaries[eid]['name'];
        }
    }
    return 'Unknown Empire';
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
    groupState: GroupState,
    empireSelector: (snap: any, empireId: number) => number,
    reducer: GroupReducer = sumReducer
): GroupTimeseries[] => {
    const groups = groupState.groups;
    return Object.keys(groups).map(Number).map(gid => {
        const g = groups[gid];
        return {
            group: g,
            timeseries: {
                label: g.name,
                selector: snap => {
                    const members = g.isFederation ?
                        getFederationMembers(snap, g.id)
                        : g.members;
                    return members.reduce((value: number, eid: number) => {
                        return reducer(value, empireSelector(snap, eid), members.length);
                    }, 0);
                }
            }
        } as GroupTimeseries;
    });
}
