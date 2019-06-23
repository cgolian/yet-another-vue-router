import { checkRouteGuards, createRoute, mapDynamicSegments, matchPathToComponent, processRoutes } from './util/routing';
import { initRouterView, initRouterLink } from './components';
import { RouteDefinition } from './models/models';

export function install(Vue: any, options: { routes: RouteDefinition[] }) {
    // process routes and init Vue router instance
    const processedRoutes = processRoutes(options.routes);
    const initialRouterView = matchPathToComponent(window.location.pathname, processedRoutes);
    const initRoute = mapDynamicSegments(
        initialRouterView.pathRegex, window.location.pathname, initialRouterView.dynamicSegments);
    const router = new Vue({
        data: {
            routerView: initialRouterView,
            route: initRoute,
        },
        methods: {
            navigate(to: string) {
                // title can stay empty - FF currently ignores this parameter
                const state = history.state;
                history.pushState(state, '', to);
            }
        }
    });
    // attach to prototype current route so dynamic segments can be retrieved inside of any component.
    Vue.prototype.$router = router;

    // redefine history.pushState
    const originalPushState = window.history.pushState;
    window.history.pushState = function (data, title, url) {
        // create route objects and check route guards
        const to = matchPathToComponent(url, processedRoutes);
        const fromRoute = createRoute(router.routerView, window.location.pathname);
        const toRoute = createRoute(to, url);
        const routeGuardsPassed = checkRouteGuards(fromRoute, toRoute);

        // if route guards conditions are met, navigate away
        if (routeGuardsPassed) {
            originalPushState.apply(window.history, [data, title, url]);
            router.routerView = to;
            if (router.routerView && router.routerView.dynamicSegments) {
                router.route = mapDynamicSegments(
                    router.routerView.pathRegex, window.location.pathname, router.routerView.dynamicSegments);
            }
        }
    };

    // init Vue components
    initRouterView(Vue);
    initRouterLink(Vue);
}
