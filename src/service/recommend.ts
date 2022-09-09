import { get } from "./base";
import RecommendData = Recommend.RecommendData;

export function getRecommend(): Promise<RecommendData> {
    return get('/api/getRecommend');
}