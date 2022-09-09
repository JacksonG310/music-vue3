import SongDetailType = Song.SongDetailType
declare namespace Player {
    interface PlayerState {
        sequenceList: Array<SongDetailType>, // 顺序播放列表
        playList: Array<SongDetailType>, // 当前播放列表
        playing: boolean, // 播放/暂停状态
        playMode: number,// 播放顺序
        currentIndex: number,//当前播放歌曲索引
        fullScreen: boolean,
        favouriteList: Array<SongDetailType>
    }
    interface ListpayloadType {
        list: Array<SongDetailType>
        index?: number
    }
    interface LyricPayLoadType {
        song: SongDetailType
        lyric: string
    }
}