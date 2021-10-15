import {Group, GroupType, LeaderboardContextValue} from './Context';

export type GroupTimeseries = {
    group: Group;
    timeseries: {
        label: string;
        selector: (data: any) => number;
    }
};

export type TimeseriesExtractionProps = {
    context: LeaderboardContextValue;
    empireSelector: (data: any, empireId: number) => number;
};

const getFederationMembers: (snap: any, fid: number) => number[] = (snap, fid) => {
    const feds = snap['federations'] as any[];
    for (let i = 0; i < feds.length; i += 1) {
        if (feds[i]['id'] === fid) {
            return feds[i]['members'].map(Number);
        }
    }
    return [];
}

export const getTimeseries: (props: TimeseriesExtractionProps) => GroupTimeseries[] = (
    {context, empireSelector}
) => {
    const groups = context.groupState.groups;
    return Object.keys(groups).map(Number).map(gid => {
        const g = groups[gid];
        return {
            group: g,
            timeseries: {
                label: g.name,
                selector: snap => {
                    const members = context.groupState.groupType === GroupType.Federations ?
                        getFederationMembers(snap, g.id)
                        : g.members;
                    return members.reduce((value: number, eid: number) => {
                        return value + empireSelector(snap, eid);
                    }, 0);
                }
            }
        } as GroupTimeseries;
    });
}
