import pathToRegexp = require("path-to-regexp");
import { Key } from 'path-to-regexp';

import { NavigationError, ProcessedRouteObject, ProcessedRoutes, RouteObject } from './models';

export function matchCurrentView(processedRoutes: ProcessedRoutes) {
    const currentPath = window.location.pathname;
    for (let key in processedRoutes) {
        const routeObject: ProcessedRouteObject = processedRoutes[key];
        if (routeObject.pathRegex.test(currentPath)) {
            return routeObject.component;
        }
    }
    throw new NavigationError(`Could not match any component for route: ${currentPath}`);
}

export function processRoutes(routes: RouteObject[]) : ProcessedRoutes {
    const processedRoutes: ProcessedRoutes = {};
    routes.forEach((route: RouteObject) => {
        const dynamicSegments: Key[] = [];
        const pathRegex = pathToRegexp(route.path, dynamicSegments);
        processedRoutes[route.path] = {
            path: route.path,
            component: route.component,
            pathRegex,
            dynamicSegments
        };
    });
    return processedRoutes;
}
