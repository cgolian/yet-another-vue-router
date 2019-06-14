import { VueConstructor } from 'vue';

import { matchCurrentView, processRoutes } from './routing';
import { initRouterView, initRouterLink } from './components';
import { RouteObject } from './models';

export function install(Vue: VueConstructor, options: { routes: RouteObject[] }) {
    // process routes and init Vue router instance
    const processedRoutes = processRoutes(options.routes);
    const router = new Vue({
        data: {
            routerView: matchCurrentView(processedRoutes),
            processedRoutes
        }
    });

    // redefine history.pushState
    const originalPushState = window.history.pushState;
    window.history.pushState = function (data, title, url) {
        originalPushState.apply(window.history, [data, title, url]);
        router.routerView = matchCurrentView(router.processedRoutes);
    };

    // init Vue components
    initRouterView(Vue, router);
    initRouterLink(Vue);
}
