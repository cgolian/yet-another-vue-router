import { matchCurrentView, processRoutes } from './router';
import { RouteObject } from './models';

// TODO cg fix types
export function install(Vue: any, options: { routes: RouteObject[]}) {
    Vue._currentView = null;
    Vue._processedRoutes = processRoutes(options.routes);

    // redefine history.pushState
    const originalPushState = history.pushState;
    history.pushState = function (data, title, url) {
        originalPushState.apply(history, [data, title, url]);
        Vue._currentView = matchCurrentView(Vue._processedRoutes);
    };

    // register single instance of global 'yet-another-router-view' component
    // use it to display "current" view
    Vue.component('yet-another-router-view', {
        data: function () {
            return {
                currentView: Vue._currentView,
            };
        },
        // TODO cg use createElement type
        render(h: any) {
            return h('div', h(this.data.currentView));
        }
    });

    // component 'yet-another-router-link' should take route as a prop
    // and change the current component
    Vue.component('yet-another-router-link', {
        props: {
            to: String,
        },
        // TODO cg use createElement type
        render(h: any) {
            return h('a', { attrs: { href: this.to }});
        }
    })
}
