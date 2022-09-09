import { Ref, ref } from "vue";

export default function useShortcut(props: any, groupRef: Ref<HTMLElement | undefined>) {
    const INDEX_HEIGHT = 18;
    const scrollRef = ref();
    const shortcutList = ref<Array<string>>([]);
    shortcutList.value = props.groupList.map((item: Singer.SingerGroupType) => {
        return item.title;
    })

    const touch = {
        startY: 0,
        moveY: 0,
        touchIndex: 0
    }

    const onShortcutTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement
        const touchIndex = parseInt(target.dataset.index!);
        scrollTo(touchIndex);
        touch.startY = e.touches[0].pageY;
        touch.touchIndex = touchIndex;
    }
    const onShortcutTouchMove = (e: TouchEvent) => {
        touch.moveY = e.touches[0].pageY - touch.startY;
        const moveIndex = Math.floor(touch.moveY / INDEX_HEIGHT);
        const startIndex = touch.touchIndex;
        const targetIndex = startIndex + moveIndex;
        scrollTo(targetIndex);

    }

    const onShortcutTouchEnd = (e: TouchEvent) => {

    }

    function scrollTo(touchIndex: number) {
        if (isNaN(touchIndex)) return;
        touchIndex = Math.max(0, Math.min(shortcutList.value.length - 1, touchIndex));
        const list = groupRef.value!.children as HTMLCollection;
        const scrollTarget = list[touchIndex];
        const scroll = scrollRef.value.scroll;
        scroll.scrollToElement(scrollTarget);
    }
    return {
        shortcutList,
        onShortcutTouchStart,
        onShortcutTouchMove,
        onShortcutTouchEnd,
        scrollRef,
    }
}