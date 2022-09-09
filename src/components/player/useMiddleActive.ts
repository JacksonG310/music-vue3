import { ref } from 'vue';

export default function useMiddleActive() {
    const currentShow = ref('cd');
    const middleLStyle = ref();
    const middleRStyle = ref();

    const touch = {
        startX: 0,
        startY: 0,
        moveX: 0,
        moveY: 0,
        percent: 0,
        directionLocked: ''
    }
    let currentView = 'cd';
    const onMiddleTouchStart = (e: TouchEvent) => {
        touch.startX = e.touches[0].pageX;
        touch.startY = e.touches[0].pageY;
    }
    const onMiddleTouchMove = (e: TouchEvent) => {

        touch.moveX = e.touches[0].pageX - touch.startX;
        touch.moveY = e.touches[0].pageY - touch.startY;

        touch.directionLocked = ''

        const absMoveX = Math.abs(touch.moveX);
        const absMoveY = Math.abs(touch.moveY);

        // 方向锁
        if (!touch.directionLocked) {
            touch.directionLocked = absMoveX >= absMoveY ? 'h' : 'v';
        }

        if (touch.directionLocked == 'v') return;


        const offsetLeft = currentView === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, offsetLeft + touch.moveX)); // 歌词界面在滚动过程中的偏移量
        touch.percent = Math.abs(offsetWidth / window.innerWidth);
        // 在拖动的时候。currentShow是会变化的，所以需要currentView
        if (currentView === 'cd') {
            if (touch.percent > 0.2) {
                currentShow.value = 'lyric';
            } else {
                currentShow.value = 'cd';
            }
        } else {
            if (touch.percent < 0.8) {
                currentShow.value = 'cd';
            } else {
                currentShow.value = 'lyric';
            }
        }
        middleLStyle.value = {
            opacity: 1 - touch.percent,
            transitionDuration: '0ms'
        }
        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px,0,0)`,
            transitionDuration: `0ms`

        }
    }
    const onMiddleTouchEnd = (e: TouchEvent) => {
        let offsetWidth;
        let opacity;
        if (currentShow.value === 'cd') {
            currentView = 'cd';
            offsetWidth = 0;
            opacity = 1;
        } else {
            currentView = 'lyric';
            offsetWidth = -window.innerWidth;
            opacity = 0;
        }
        const duration = 300;
        middleLStyle.value = {
            opacity: opacity,
            transitionDuration: `${duration}ms`
        }
        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px,0,0)`,
            transitionDuration: `${duration}ms`
        }

    }

    return {
        currentShow,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        middleLStyle,
        middleRStyle
    }
}