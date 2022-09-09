import PlayerState = Player.PlayerState
import { FAVOURITE_KEY, PLAY_MODE } from '@/assets/ts/constants'
import { load } from '@/assets/ts/array-store';
const state: PlayerState = {
    sequenceList: [], // 顺序播放列表
    playList: [], // 当前播放列表
    playing: false, // 播放/暂停状态
    playMode: PLAY_MODE.sequence,// 播放顺序
    currentIndex: 0,//当前播放歌曲状态
    fullScreen: false,
    favouriteList: load(FAVOURITE_KEY)
}

export default state;