import Scroll from './components/base/scroll/scroll.vue';
declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        Scroll: typeof Scroll
    }
}
