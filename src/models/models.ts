import { Key } from 'path-to-regexp';

// "active" route
export interface Route {
    path: string
    beforeEnter? : RouteGuard,
    beforeLeave? : RouteGuard,
    dynamicParts?: {
        [key: string]: string
    }
}

// used by user to declare route guards
type RouteGuard = (from: Route, to: Route, next: Function) => void

// used by user to declare routes
export interface RouteDefinition {
    path: string
    component: object
    beforeEnter?: RouteGuard
    beforeLeave?: RouteGuard
}

// map of path params with their values
export interface RouteMap {
    [key: string]: string
}

// map of processed routes
export interface ProcessedRoutes {
    [key: string]: ProcessedRouteObject
}

// created from RouteDefinition, contains regex enabling to match the path and dynamic segments
export interface ProcessedRouteObject {
    path: string
    component: any
    pathRegex: RegExp
    dynamicSegments: Key[]
    beforeEnter?: RouteGuard
    beforeLeave?: RouteGuard
}

// thrown when no component could be matched
export class NavigationError extends Error {}
