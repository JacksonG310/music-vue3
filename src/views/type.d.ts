declare namespace Recommend {
    interface RecommendData {
        sliders: Array<SlidersPageType>;
        albums: Array<AlbumsType>;
    }

    interface SlidersPageType {
        id: string;
        link: string;
        pic: string;
    }

    interface AlbumsType {
        id: number;
        username: string;
        title: string;
        pic: string
    }
}

declare namespace Singer {
    interface SingerListData {
        singers: SingerGroupType[]
    }
    interface SingerGroupType {
        title: string;
        list: SingerItemType[]
    }
    interface SingerItemType {
        id: number;
        mid: string;
        name: string;
        pic: string;
    }
    interface SingerDetailData {
        songs: Array<Song.SongDetailType>
    }
}

declare namespace Song {
    interface SongDetailType {
        id: number;
        mid: string;
        name: string;
        singer: string;
        url: string;
        duration: number;
        pic: string;
        album: string;
        lyric?: string
    }

}