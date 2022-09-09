import { PLAY_MODE } from "@/assets/ts/constants"
import { ActionContext } from 'vuex'
import { shuffle } from "@/assets/ts/util"
import ListpayloadType = Player.ListpayloadType
import PlayerState = Player.PlayerState
import SongDetailType = Song.SongDetailType
export function setectPlay({ commit }: ActionContext<PlayerState, PlayerState>, { list, index }: ListpayloadType) {
    commit("setPlayMode", PLAY_MODE.sequence); // 改变播放播放列表顺序
    commit("setSequenceList", list); // 设置顺序播放列表
    commit("setPlayingState", true); // 设置播放、暂停状态
    commit("setFullScreen", true); // 全屏
    commit("setPlayList", list); // 设置当前播放列表
    commit("setCurrentIndex", index); // 设置当前歌曲索引
}

export function randomPlay({ commit }: ActionContext<PlayerState, PlayerState>, list: Array<SongDetailType>) {
    commit("setPlayMode", PLAY_MODE.random); // 改变播放播放列表顺序
    commit("setSequenceList", list); // 设置顺序播放列表
    commit("setPlayingState", true); // 设置播放、暂停状态
    commit("setFullScreen", true); // 全屏
    commit("setPlayList", shuffle(list)); // 设置当前播放列表
    commit("setCurrentIndex", 0); // 设置当前歌曲索引
}

export function changeMode({ commit, state, getters }: ActionContext<PlayerState, PlayerState>, mode: number) {
    const currentSongId = getters.currentSong.id;
    if (mode === PLAY_MODE.random) {
        // 修改列表为随机列表
        commit('setPlayList', shuffle(state.sequenceList));
    } else {
        commit("setPlayMode", state.sequenceList);
    }
    // @ts-ignore
    const currentIndexInNewList = state.playList.findIndex(song => song.id === currentSongId);
    // 防止当前歌曲切歌
    commit('setCurrentIndex', currentIndexInNewList);
    commit('setPlayMode', mode);
}

export function removeSong({ commit, state }: ActionContext<PlayerState, PlayerState>, song: SongDetailType) {

    const sequenceList = state.sequenceList.slice();
    const playList = state.playList.slice();

    const sequenceIndex = findIndex(sequenceList, song);
    const playIndex = findIndex(playList, song);
    if (sequenceIndex < 0 || playIndex < 0) return;

    sequenceList.splice(sequenceIndex, 1);
    playList.splice(playIndex, 1);

    let currentIndex = state.currentIndex;
    if (playIndex < currentIndex || currentIndex === playList.length - 1) {
        currentIndex--;
    }

    commit('setSequenceList', sequenceList);
    commit('setPlayList', playList);
    commit('setCurrentIndex', currentIndex);

    if (!playList.length) {
        commit("setPlayingState", false); // 设置播放、暂停状态
    }
}

function findIndex(list: Array<SongDetailType>, song: SongDetailType) {

    return list.findIndex(item => item.id === song.id)
}

export function clearSongList({ commit }: ActionContext<PlayerState, PlayerState>) {
    commit('setSequenceList', []);
    commit('setPlayList', []);
    commit('setCurrentIndex', 0);
    commit("setPlayingState", false); // 设置播放、暂停状态

}