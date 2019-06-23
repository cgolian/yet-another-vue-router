import { CreateElement } from 'vue';

export function initRouterView(Vue: any) {
    // register 'yet-another-router-view' component
    // use it to display "current" view
    Vue.component('yet-another-router-view', {
        render(h: CreateElement) {
            const props = this.$router.route;
            return h('div', { attrs: { class: 'router-outlet' }},
                [h(this.$router.routerView.component, {props})]);
        }
    });
}
