import { computed } from "vue";
import { useStore } from "vuex";
import { PLAY_MODE } from "@/assets/ts/constants";

export default function useMode() {
    const store = useStore();
    const playMode = computed(() => store.state.playMode);
    const modeIcon = computed(() => {
        return playMode.value === PLAY_MODE.sequence
            ? 'icon-sequence' :
            playMode.value === PLAY_MODE.random ? 'icon-random' : 'icon-loop';
    })

    const changeMode = () => {
        const mode = (playMode.value + 1) % 3;

        store.dispatch('changeMode', mode);
    };

    const modeText = computed(() => {
        return playMode.value === PLAY_MODE.sequence
            ? '顺序播放' :
            playMode.value === PLAY_MODE.random ? '随机播放' : '单曲循环';
    })
    return {
        modeIcon,
        changeMode,
        modeText
    }
}