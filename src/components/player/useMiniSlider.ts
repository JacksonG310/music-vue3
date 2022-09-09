import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
BScroll.use(Slide);

export default function useMiniSlider() {
    const store = useStore()
    const sliderWrapperRef = ref();
    const slider = ref();

    const fullScreen = computed(() => store.state.fullScreen);
    const playList = computed(() => store.state.playList);
    const sliderShow = computed(() => !fullScreen.value && !!playList.value);
    const currentIndex = computed(() => store.state.currentIndex);

    onMounted(() => {
        let sliderVal: BScroll | undefined;
        // 当小播放器展示时再挂载scroll
        watch(sliderShow, async (newSliderShow) => {
            if (newSliderShow) {
                await nextTick();
                if (sliderVal) {
                    // 重新计算 BetterScroll
                    sliderVal.refresh();
                    return
                };
                sliderVal = new BScroll(sliderWrapperRef.value, {
                    click: true,
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    bounce: false,
                    probeType: 2,
                    slide: {
                        autoplay: false,
                        loop: true
                    }
                });
                sliderVal.on('slidePageChanged', ({ pageX }: any) => {
                    store.commit('setCurrentIndex', pageX);
                })
                // 去往当前歌曲
                sliderVal.goToPage(currentIndex.value, 0, 0);
            }

        })

        watch(currentIndex, (newIndex) => {
            if (sliderVal && sliderShow.value) {
                sliderVal.goToPage(newIndex, 0, 0);
            }
        });
        watch(playList, async (newList) => {
            if (sliderVal && sliderShow.value && newList.length) {
                await nextTick();
                sliderVal.refresh();
            }
        })
    })

    onUnmounted(() => {
        if (slider.value) slider.value.destory();
    })
    return {
        slider,
        sliderWrapperRef,
    }
}