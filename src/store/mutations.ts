import PlayerState = Player.PlayerState
import LyricPayLoadType = Player.LyricPayLoadType
const mutations = {
    setPlayingState(state: PlayerState, playing: boolean) {
        state.playing = playing
    },
    setSequenceList(state: PlayerState, list: any) {
        state.sequenceList = list
    },
    setPlayList(state: PlayerState, list: any) {
        state.playList = list;
    },
    setPlayMode(state: PlayerState, mode: number) {
        state.playMode = mode;
    },
    setCurrentIndex(state: PlayerState, index: number) {
        state.currentIndex = index;
    },
    setFullScreen(state: PlayerState, fullScreen: boolean) {
        state.fullScreen = fullScreen;
    },
    setFavouriteList(state: PlayerState, list: Array<SongDetailType>) {
        state.favouriteList = list;
    },
    addSongLyric(state: PlayerState, { song, lyric }: LyricPayLoadType) {
        // 这里是直接修改数组内的对象，所以会发生改变
        state.sequenceList.forEach((item) => {
            if (item.mid === song.mid) {
                item.lyric = lyric;
            }
            return item;
        })
    }
}

export default mutations