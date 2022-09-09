import { ref } from "vue";
import animations from 'create-keyframe-animation';

export default function useCdAnimation() {
    const cdWrapperRef = ref<HTMLElement>();
    let entering = false;
    let leaving = false;
    function enter(el: HTMLElement, done: any) {
        entering = true;
        if (leaving) afterLeave();
        const { x, y, scalePercent } = getPosAndScale();
        const animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scalePercent})`
            },
            100: {
                transform: `translate3d(0,0,0) scale(1)`
            }
        }
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 600,
                easing: 'cubic-bezier(0.45,0,0.55,1)'
            }
        })
        animations.runAnimation(cdWrapperRef.value!, 'move', done);
    }

    function afterEnter() {
        entering = false;
        animations.unregisterAnimation('move');
        cdWrapperRef.value!.style.animation = '';
    }
    function leave(el: HTMLElement, done: any) {
        leaving = true;
        if (entering) afterEnter();
        const { x, y, scalePercent } = getPosAndScale();
        const cdWrapperEl = cdWrapperRef.value!;
        cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45,0,0.55,1)';
        cdWrapperEl.style.transform = `translate3d(${x}px,${y}px,0) scale(${scalePercent})`;
        cdWrapperEl.addEventListener('transitionend', next);

        function next() {
            cdWrapperEl.removeEventListener('transitionend', next);
            done();
        }
    }
    function afterLeave() {
        leaving = false;
        const cdWrapperEl = cdWrapperRef.value!;
        cdWrapperEl.style.transition = '';
        cdWrapperEl.style.transform = '';
    }

    function getPosAndScale() {
        // 大变小
        const miniWidth = 40;// 小cd图片的宽度
        const miniLeft = 40;// 小cd圆心到屏幕左边的距离
        const miniBottom = 30; // 小cd圆心到底屏幕部的距离
        const bigTop = 80;// 大cd顶部到屏幕顶部的距离
        const bigWidth = window.innerWidth * 0.8; // 大cd到屏幕左边的距离
        const x = (-1 * (window.innerWidth / 2 - miniLeft)); // 横坐标偏移量
        const y = window.innerHeight - bigTop - bigWidth / 2 - miniBottom; // 纵坐标偏移量
        const scalePercent = miniWidth / bigWidth;
        console.log();

        return {
            x, y, scalePercent
        }
    }
    return {
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave,
    }
}