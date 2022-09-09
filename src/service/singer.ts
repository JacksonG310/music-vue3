import { get } from './base';
import SingerListData = Singer.SingerListData
export function getSingerList(): Promise<SingerListData> {
    return get('/api/getSingerList');
}

export function getSingerDetail(singer: Singer.SingerItemType) {

    return get('/api/getSingerDetail', {
        mid: singer.mid
    });
}