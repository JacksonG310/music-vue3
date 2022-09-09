import { getLyric } from "@/service/song";
import { Component, computed, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import LyricParser from 'lyric-parser';
type useLyricParams = { songReady: Ref<boolean>, currentTime: Ref<number> }
export default function useLyric({ songReady, currentTime }: useLyricParams) {
    const store = useStore();
    const currentSong = computed(() => store.getters.currentSong);
    const currentSongLyric = ref();// 当前播放的歌曲的歌词文本
    const currentLineIndex = ref(0);// 播放歌词的索引

    const lyricScrollRef = ref();
    const lyricListRef = ref<HTMLElement>();

    const pureMusicLyric = ref('');// 纯音乐的歌词
    const playingLyric = ref(''); // 正在播放的一句歌词
    // @ts-ignore
    const handleLyric = ({ lineNum, txt }) => {
        currentLineIndex.value = lineNum;
        playingLyric.value = txt;
        const scrollCom = lyricScrollRef.value;
        const listEl = lyricListRef.value;
        if (!listEl) return;
        // 使歌词居中
        if (lineNum > 5) {
            // 可视区顶部的元素
            const lineEl = listEl.children[lineNum - 5];
            scrollCom.scroll.scrollToElement(lineEl, 1000);
        } else {
            scrollCom.scroll.scrollToElement(0, 0, 1000);
        }
    }

    const playLyric = () => {
        if (currentSongLyric.value) {
            currentSongLyric.value.seek(currentTime.value * 1000);
        }
    }

    const stopLyric = () => {
        if (currentSongLyric.value) {
            currentSongLyric.value.stop();
        }
    }
    const reset = () => {
        currentSongLyric.value = null;
        currentLineIndex.value = 0;
        pureMusicLyric.value = "";
        playingLyric.value = "";
    }
    watch(currentSong, async (newSong) => {
        if (!newSong.url || !newSong.id) return;
        stopLyric();
        reset();// 重置状态
        const lyric = await getLyric(newSong);
        store.commit('addSongLyric', {
            song: newSong,
            lyric,
        })
        if (currentSong.value.lyric !== lyric) return; // 切换过快，就不执行后面的步骤
        currentSongLyric.value = new LyricParser(lyric, handleLyric);
        const hasLyric = currentSongLyric.value.lines.length;
        // 同步歌词
        if (hasLyric) {
            if (songReady.value) {
                playLyric();
            }
        } else {
            pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '');
            playingLyric.value = pureMusicLyric.value
        }
    })
    return {
        currentSongLyric,
        currentLineIndex,
        playLyric,
        stopLyric,
        lyricListRef,
        lyricScrollRef,
        pureMusicLyric,
        playingLyric
    }
}
