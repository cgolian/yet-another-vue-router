import {
    checkRouteGuards,
    mapDynamicSegments,
    createRoute,
    matchPathToComponent,
    processRoutes
} from '../../src/util/routing';
import { ProcessedRouteObject, ProcessedRoutes, RouteDefinition } from '../../src/models/models';

test('Should process static route.', () => {
    const FooComponent = { template: `<div>foo</div>`};
    const routes: RouteDefinition[] = [
        {
            path: '/foo',
            component: FooComponent
        }
    ];

    const result =  processRoutes(routes); // TEST

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toEqual(1);

    expect(result[routes[0].path]).toBeDefined();
    expect(result[routes[0].path].path).toEqual(routes[0].path);
    expect(result[routes[0].path].pathRegex).toEqual(/^\/foo(?:\/)?$/i);
    expect(result[routes[0].path].component).toEqual(routes[0].component);
    expect(result[routes[0].path].dynamicSegments).toEqual([]);
});

test('Should process dynamic route', () => {
    const BarComponent = { template: `<div>bar</div>`};
    const routes: RouteDefinition[] = [
        {
            path: '/bar/:name/:id',
            component: BarComponent
        }
    ];

    const result = processRoutes(routes); // TEST

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toEqual(1);

    expect(result[routes[0].path]).toBeDefined();
    expect(result[routes[0].path].path).toEqual(routes[0].path);
    expect(result[routes[0].path].pathRegex).toEqual(/^\/bar\/([^\/]+?)\/([^\/]+?)(?:\/)?$/i);
    expect(result[routes[0].path].component).toEqual(routes[0].component);
    expect(result[routes[0].path].dynamicSegments).toBeDefined();
    expect(result[routes[0].path].dynamicSegments.length).toEqual(2);
});

test('Should match static route.', () => {
    const FooComponent = { template: `<div>foo</div>`};
    const processedFoo: ProcessedRouteObject = {
        path: '/foo',
        component: FooComponent,
        pathRegex: /^\/foo(?:\/)?$/i,
        dynamicSegments: []
    };
    const processedRoutes: ProcessedRoutes = {
        foo: processedFoo
    };

    const result = matchPathToComponent('/foo', processedRoutes); // TEST

    expect(result).toEqual(processedFoo);
});

test('Should match dynamic route.', () => {
    const FooComponent = {template: `<div>foo</div>`};
    const BarComponent = {template: `<div>bar</div>`};

    const processedFoo: ProcessedRouteObject = {
        path: '/foo',
        component: FooComponent,
        pathRegex: /^\/foo(?:\/)?$/i,
        dynamicSegments: []
    };
    const processedBar: ProcessedRouteObject = {
        path: '/bar',
        component: BarComponent,
        pathRegex: /^\/bar\/([^\/]+?)(?:\/)?$/i,
        dynamicSegments: [
            {
                name: 'id',
                prefix: '/',
                delimiter: '/',
                optional: false,
                repeat: false,
                pattern: '[^\\/]+?'
            }
        ]
    };
    const processedRoutes: ProcessedRoutes = {
        foo: processedFoo,
        bar: processedBar
    };

    const result = matchPathToComponent('/bar/123', processedRoutes); // TEST

    expect(result).toEqual(processedBar);
});

test('Should not match any route.', () => {
    const processedRoutes: ProcessedRoutes = {
        foo: {
            path: '/foo',
            component: null,
            pathRegex: /^\/foo(?:\/)?$/i,
            dynamicSegments: null,
        },
        bar: {
            path: '/bar',
            component: null,
            pathRegex: /^\/bar(?:\/)?$/i,
            dynamicSegments: null,
        }
    };

    // expecting Error to be thrown instead of NavigationError - because of limitations of Babel?
    // see https://github.com/facebook/jest/issues/2123
    expect(() => { matchPathToComponent('/xyz', processedRoutes) }).toThrow(Error); // TEST
});

test('Should pass both beforeEnter and beforeLeave route guards.', () => {
    const from: ProcessedRouteObject = {
        path: '/foo',
        component: null,
        pathRegex: /^\/foo(?:\/)?$/i,
        dynamicSegments: null,
        beforeLeave: (from, to, next) => {
            next(true);
        }
    };
    const to: ProcessedRouteObject = {
        path: '/bar',
        component: null,
        pathRegex: /^\/bar(?:\/)?$/i,
        dynamicSegments: null,
        beforeEnter: (from, to, next) =>{
            next(true);
        }
    };

    const result = checkRouteGuards(from, to);

    expect(result).toEqual(true);
});

test('Should pass beforeLeave but not beforeEnter route guard.', () => {
    const from: ProcessedRouteObject = {
        path: '/foo',
        component: null,
        pathRegex: /^\/foo(?:\/)?$/i,
        dynamicSegments: null,
        beforeLeave: () => {}
    };
    const to: ProcessedRouteObject = {
        path: '/bar',
        component: null,
        pathRegex: /^\/bar(?:\/)?$/i,
        dynamicSegments: null,
        beforeEnter: (from, to, next) =>{
            if (from.path === '/foo') {
                next(false);
            }
        }
    };

    const result = checkRouteGuards(from, to);

    expect(result).toEqual(false);
});


test('Should create Route object from ProcessedRouteObject object', () => {
    const foo: ProcessedRouteObject = {
        path: '/foo',
        component: null,
        pathRegex: /^\/foo\/([^\/]+?)(?:\/)?$/i,
        dynamicSegments: [{
            name: 'id',
            prefix: '/',
            delimiter: '/',
            optional: false,
            repeat: false,
            pattern: '[^\\/]+?'
        }],
        beforeEnter: () => {},
        beforeLeave: (from, to, next) =>{
            if (from.path === '/foo') {
                next(false);
            }
        }
    };

    const result = createRoute(foo, '/foo/123'); // TEST

    expect(result).not.toBeNull();
    expect(result.path).toEqual('/foo/123');
    expect(result.beforeLeave).toEqual(foo.beforeLeave);
    expect(result.beforeEnter).toEqual(foo.beforeEnter);
    expect(result.dynamicParts).not.toBeNull();
    expect(result.dynamicParts.id).toEqual('123');
});

test('Should retrieve dynamic parts from path.', () => {
    const pathRegex =     /^\/bar\/([^\/]+?)\/([^\/]+?)(?:\/)?$/i;
    const dynamicSegments = [
        {
            name: 'name',
            prefix: '/',
            delimiter: '/',
            optional: false,
            repeat: false,
            pattern: '[^\\/]+?'
        },
        {
            name: 'id',
            prefix: '/',
            delimiter: '/',
            optional: false,
            repeat: false,
            pattern: '[^\\/]+?'
        },
    ];

    const path = '/bar/joe/123';

    const result = mapDynamicSegments(pathRegex, path, dynamicSegments); // TEST

    expect(result).not.toBeNull();
    expect(result.name).toEqual('joe');
    expect(result.id).toEqual('123');
});
