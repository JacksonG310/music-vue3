import { computed, nextTick, ref, watch } from "vue";
export default function useFixed(props: any) {
    const TITLE_HEIGHT = 30;// 固定标题的高度
    const groupRef = ref<HTMLElement>();
    const groupHeightList = ref<number[]>([]);

    let listHeight = groupHeightList.value;// 列表高度数组

    const scrollY = ref(0);
    const currentGroupIndex = ref(0);

    const distance = ref(0); // 下一个组的底部离可视区域顶部的距离
    // 监听滚动
    const onScroll = (pos: any) => {
        scrollY.value = -1 * pos.y;

    }
    // 监听参数的传入，计算每一组的高度
    watch(() => props.groupList, async () => {
        await nextTick();
        calculate();

    }, {
        immediate: true
    })
    // 监听滚动的Y值的变化，然后计算出当前在那一组内
    watch(scrollY, async (newY) => {
        for (let i = 0; i < listHeight.length - 1; i++) {
            const heightTop = listHeight[i];
            const heightBottom = listHeight[i + 1];
            if (newY >= heightTop && newY < heightBottom) {
                currentGroupIndex.value = i;
                // 下一个组的顶部就是上一个组的底部，计算下一个组的底部离可视区域顶部的距离
                distance.value = heightBottom - newY;
                break;
            }
        }


    })

    const fixedStyle = computed(() => {
        const distanceVal = distance.value;
        const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0;

        return {
            transform: `translate3d(0,${diff}px,0)`
        }
    })

    // 计算固定的title
    const fixedTitle = computed(() => {
        if (scrollY.value <= 0) {
            return '';
        }
        return props.groupList[currentGroupIndex.value].title;
    })
    function calculate() {
        const list = groupRef.value!.children;// 列表节点

        listHeight = [];// 初始化数组
        let height = 0;// 初始化高度
        listHeight.push(height);
        for (let i = 0; i < list?.length; i++) {
            const item = list[i];
            height += item.clientHeight;
            listHeight.push(height);
        }

    }
    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentGroupIndex
    };
}