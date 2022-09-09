import BScroll from "@better-scroll/core";
import ObserveDOM from "@better-scroll/observe-dom";

BScroll.use(ObserveDOM)
import { onMounted, onUnmounted, ref, Ref } from "vue";
export default function useScroll(wrapperRef: Ref, options: any, emit: any) {
    const scroll = ref<BScroll>();
    onMounted(() => {
        scroll.value = new BScroll(wrapperRef.value, {
            observeDOM: true,
            ...options
        });
        if (options.probeType > 0) {
            scroll.value.on('scroll', (pos: number) => {
                emit('scroll', pos);
            })
        }
    });
    onUnmounted(() => {
        // scroll.value.destory();
    })
    return {
        scroll
    }
}