import PlayerState = Player.PlayerState
export const currentSong = (state: PlayerState) => {
    return state.playList[state.currentIndex] || {};
}