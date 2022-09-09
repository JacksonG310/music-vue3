import { get } from "./base";
import RecommendData = Recommend.RecommendData;
import AlbumsType = Recommend.AlbumsType;
export function getRecommend(): Promise<RecommendData> {
    return get('/api/getRecommend');
}

export function getAlbum(album: AlbumsType): Promise<Array<AlbumsType>> {
    return get('/api/getAlbum', {
        id: album.id
    })
}