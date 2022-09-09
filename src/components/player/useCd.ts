import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

export default function useCd() {
    const cdRef = ref<HTMLElement>();
    const cdImgRef = ref<HTMLElement>();
    const store = useStore();
    const playing = computed(() => store.state.playing);
    const cdClass = computed(() => {
        return playing.value ? 'playing' : ''
    })

    const syncTransForm = (wrapper: HTMLElement, inner: HTMLElement) => {
        /** 转动的时候是图片再转，包裹图片的容器是不会转的
         * 所以在每次将角度同步到外部容器的时候，都需要加上容器原来的角度
         * */

        // 先计算内层transform
        const innerTransform = getComputedStyle(inner).transform;
        const wrapperTransform = getComputedStyle(wrapper).transform;
        // 同步到外层
        wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat('', wrapperTransform);
    }

    watch(playing, (newPlaying) => {
        if (!newPlaying) {
            // 不同步的话，当移除动画的时候，图片就会返回原位
            syncTransForm(cdRef.value!, cdImgRef.value!);
        }
    })


    return { cdClass, cdRef, cdImgRef }
}