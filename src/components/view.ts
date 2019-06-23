import { CreateElement } from 'vue';
import { NavigationError } from '../models/models';

export function initRouterView(Vue: any) {
    // register 'yet-another-router-view' component
    // use it to display "current" view
    Vue.component('yet-another-router-view', {
        props: {
            name: String
        },

        render(h: CreateElement) {
            const props = this.$router.route;
            let routerOutletClass = 'router-outlet';
            // set the component to be displayed to default component
            let componentToBeDisplayed = this.$router.routerView.component;
            // multiple router views were defined, display the correct component in each of them
            if (this.$router.routerView.components) {
                const currentView = this.$router.routerView;
                if (this.name) {
                    if (currentView.components) {
                        const component = currentView.components[this.name];
                        if (component) {
                            componentToBeDisplayed = component;
                            routerOutletClass = routerOutletClass + '-' + this.name;
                        } else {
                            throw new NavigationError(`Named router view ${this.name} does not exist.`);
                        }
                    }
                } else {
                    componentToBeDisplayed = currentView.components['default'];
                }
            }
            return h('div', { attrs: { class: routerOutletClass }},
               [h(componentToBeDisplayed, {props})]);
        }
    });
}
