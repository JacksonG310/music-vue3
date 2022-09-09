import { get } from './base'
import TopListDataType = TopList.TopListDataType;
import TopListItemType = TopList.TopListItemType;
export function getTopList(): Promise<TopListDataType> {
    return get('/api/getTopList');
}

export function getTopListDetail(top: TopListItemType) {
    return get('/api/getTopDetail', {
        id: top.id,
        period: top.period
    })
}