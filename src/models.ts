import { Key } from 'path-to-regexp';

export interface RouteObject {
    path: string
    component: object
}

export interface ProcessedRoutes {
    [key: string]: ProcessedRouteObject
}

interface ProcessedRouteObject {
    path: string
    component: object
    pathRegex: RegExp
    dynamicSegments: Key[]
}

