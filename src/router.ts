import pathToRegexp = require("path-to-regexp");
import { Key } from 'path-to-regexp';

import { ProcessedRoutes, RouteObject } from './models';

export const processedRoutes: ProcessedRoutes = {};

export function initRouter(routes: RouteObject[]) {
    processRoutes(routes);
    // TODO instantiate component yet-another-router-outlet
    // TODO instantiate component yet-another-router-link
}

export function processRoutes(routes: RouteObject[]) {
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
}
