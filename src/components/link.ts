import { CreateElement, VueConstructor } from 'vue';

export function initRouterLink(Vue: VueConstructor) {
    // component 'yet-another-router-link' should take route as a prop
    // and change the current component
    Vue.component('yet-another-router-link', {
        props: {
            to: String,
        },
        methods: {
            navigate: function (event: Event) {
                event.preventDefault();
                // title can stay empty - FF currently ignores this parameter
                const state = history.state;
                history.pushState(state, '', this.to);
            }
        },
        render(h: CreateElement) {
            const componentData = { on: { click: this.navigate }, attrs: { href: '#' }};
            return h('a', componentData, [this.$slots.default, ' ']);
        }
    });
}
