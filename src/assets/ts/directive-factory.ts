import { createApp, Ref, Component } from "vue"
import { addClass, removeClass } from "@/assets/ts/dom"
const relativeClass = 'g-relative';

export default function createDirective(Com: Component, name: string) {
    return {
        mounted(el: HTMLElement, binding: Ref) {
            const app = createApp(Com);
            const instance = app.mount(document.createElement('div'));
            // @ts-ignore
            if (!el[name]) {
                // @ts-ignore
                el[name] = {}
            }
            // @ts-ignore
            el[name].instance = instance;
            if (binding.value) {
                append(el);
            }
        },
        updated(el: HTMLElement, binding: Ref) {
            // isloading
            // @ts-ignore
            if (binding.value !== binding.oldValue) {
                binding.value ? append(el) : remove(el);
            }
        }
    }
    function append(el: HTMLElement) {
        const style = getComputedStyle(el);

        if (['absolute', 'fixed', 're;ative'].indexOf(style.position) === -1) {
            addClass(el, relativeClass);
        }
        // @ts-ignore
        el.appendChild(el[name].instance.$el);
    }

    function remove(el: HTMLElement) {
        removeClass(el, relativeClass);
        // @ts-ignore
        el.removeChild(el[name].instance.$el);
    }
}


