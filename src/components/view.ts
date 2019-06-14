import { CreateElement, VueConstructor } from 'vue';

export function initRouterView(Vue: VueConstructor, router: { routerView: object }) {
    // register single instance of global 'yet-another-router-view' component
    // use it to display "current" view
    Vue.component('yet-another-router-view', {
        render(h: CreateElement) {
            return h('div', { attrs: { class: 'router-outlet' }}, [h(router.routerView)]);
        }
    });
}
