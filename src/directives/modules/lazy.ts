import { useIntersectionObserver } from "@vueuse/core"

export default {
    // 获取图片节点
    mounted(el: HTMLImageElement) {
        const imgSrc = el.src;
        el.src = require('@/assets/images/logo.png');
        const { stop } = useIntersectionObserver(el, ([IntersectionObserverEntry]) => {
            const { isIntersecting } = IntersectionObserverEntry;
            if (isIntersecting) {
                el.src = imgSrc;
                // 停止监听
                stop();
            }
        })
    }
}