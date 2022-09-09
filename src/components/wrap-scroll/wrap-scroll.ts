import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick, } from 'vue'
import Scroll from '@/components/base/scroll/scroll.vue'
import { useStore } from 'vuex'

export default {
    name: 'wrap-scroll',
    props: Scroll.props,
    emits: Scroll.emits,
    render(ctx: any) {
        return h(Scroll, mergeProps({
            ref: 'scrollRef'
        }, ctx.$props, {
            onScroll: (e: Event) => {
                ctx.$emit('scroll', e)
            }
        }), {
            default: withCtx(() => {
                return [renderSlot(ctx.$slots, 'default')]
            })
        })
    },
    setup() {
        const scrollRef = ref()
        const scroll = computed(() => {
            return scrollRef.value.scroll
        })

        const store = useStore()
        const playList = computed(() => store.state.playList)

        watch(playList, async () => {
            await nextTick()
            scroll.value.refresh()
        })

        return {
            scrollRef,
            scroll
        }
    }
}
