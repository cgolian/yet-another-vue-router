import pathToRegexp = require("path-to-regexp");
import { Key } from 'path-to-regexp';

import {
    NavigationError,
    ProcessedRouteObject,
    ProcessedRoutes,
    Route,
    RouteDefinition, RouteDefinitionError,
    RouteMap
} from '../models/models';

export function matchPathToComponent(currentPath: string, processedRoutes: ProcessedRoutes) : ProcessedRouteObject {
    for (let key in processedRoutes) {
        const routeObject: ProcessedRouteObject = processedRoutes[key];
        if (routeObject.pathRegex.test(currentPath)) {
            return routeObject;
        }
    }
    throw new NavigationError(`Could not match any component for route: ${currentPath}.`);
}

export function processRoutes(routes: RouteDefinition[]) : ProcessedRoutes {
    const processedRoutes: ProcessedRoutes = {};
    routes.forEach((route: RouteDefinition) => {
        const dynamicSegments: Key[] = [];
        if (route.components && route.component) {
            throw new RouteDefinitionError("Route definition can contain either 'component' " +
                "field or 'components' but not both.")
        }
        const pathRegex = pathToRegexp(route.path, dynamicSegments);
        processedRoutes[route.path] = {
            path: route.path,
            component: route.component,
            beforeEnter: route.beforeEnter,
            beforeLeave: route.beforeLeave,
            pathRegex,
            dynamicSegments,
            components: route.components
        };
    });
    return processedRoutes;
}

export function checkRouteGuards(from: Route, to: Route) : boolean {
    let routeGuardsPassed = true;
    const nextFunction = (navContinue: boolean) => {
        if (! navContinue) {
            routeGuardsPassed = false;
        }
    };
    if (from.beforeLeave) {
        from.beforeLeave(from, to, nextFunction);
    }
    if (to.beforeEnter && routeGuardsPassed) {
        to.beforeEnter(from, to, nextFunction);
    }
    return routeGuardsPassed;
}

export function createRoute(processed: ProcessedRouteObject, url: string) : Route {
    const dynamicParts = mapDynamicSegments(processed.pathRegex, url, processed.dynamicSegments);
    return {
        path: url,
        beforeEnter: processed.beforeEnter,
        beforeLeave: processed.beforeLeave,
        dynamicParts
    };
}

export function mapDynamicSegments(pathRegex: RegExp, path: string, dynamicSegments: Key[]) : RouteMap {
    // if there are any dynamic parts of url, set them
    const match = pathRegex.exec(path);
    if (match && match.length > 1) {
        // iterate from match[1] to match.length to get the dynamic parts
        const route: RouteMap = {};
        for (let i = 1; i < match.length; i++) {
            const segmentName = dynamicSegments[i - 1];
            route[segmentName.name] = match[i]
        }
        return route;
    }
    return {}
}
