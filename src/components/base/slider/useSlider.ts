import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { Page } from "@better-scroll/slide/dist/types/SlidePages";
import { onMounted, onUnmounted, ref, Ref } from "vue";
BScroll.use(Slide);
export default function useSlider(wrapperRef: Ref) {
    const slider = ref();
    const currentPageIndex = ref(0);
    // 初始化
    onMounted(() => {
        slider.value = new BScroll(wrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false, // 动量动画
            bounce: false,// 回弹动画
            probeType: 2, // 当手指在滚动区域时，一直触发scroll事件
            slide: true
        });
        // 监听翻页事件
        slider.value.on('slideWillChange', (page: Page) => {
            currentPageIndex.value = page.pageX;
        })
    });
    // 销毁
    onUnmounted(() => {
        // slider.value.destory();
    })
    return {
        slider,
        currentPageIndex
    };
}