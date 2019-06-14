import { Key } from 'path-to-regexp';

export interface RouteObject {
    path: string
    component: object
}

export interface ProcessedRoutes {
    [key: string]: ProcessedRouteObject
}

export interface ProcessedRouteObject {
    path: string
    component: any
    pathRegex: RegExp
    dynamicSegments: Key[]
}

export class NavigationError extends Error {}
