import { matchCurrentView, processRoutes } from '../src/router';
import { ProcessedRoutes, RouteObject } from '../src/models';

test('Should process static route.', () => {
    const FooComponent = { template: `<div>foo</div>`};
    const routes: RouteObject[] = [
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
    const routes: RouteObject[] = [
        {
            path: '/bar/:id',
            component: BarComponent
        }
    ];

    const result = processRoutes(routes); // TEST

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toEqual(1);

    expect(result[routes[0].path]).toBeDefined();
    expect(result[routes[0].path].path).toEqual(routes[0].path);
    expect(result[routes[0].path].pathRegex).toEqual(/^\/bar\/([^\/]+?)(?:\/)?$/i);
    expect(result[routes[0].path].component).toEqual(routes[0].component);
    expect(result[routes[0].path].dynamicSegments).toBeDefined();
    expect(result[routes[0].path].dynamicSegments.length).toEqual(1);
});

test('Should match static route.', () => {
    const FooComponent = { template: `<div>foo</div>`};
    const processedRoutes: ProcessedRoutes = {
        foo: {
            path: '/foo',
            component: FooComponent,
            pathRegex: /^\/foo(?:\/)?$/i,
            dynamicSegments: []
        }
    };

    history.replaceState({}, 'foo', '/foo');

    const result = matchCurrentView(processedRoutes); // TEST

    expect(result).toEqual(FooComponent);
});

test('Should match dynamic route.', () => {
    const FooComponent = { template: `<div>foo</div>`};
    const BarComponent = { template: `<div>bar</div>`};
    const processedRoutes: ProcessedRoutes = {
        // /foo
        foo: {
            path: '/foo',
            component: FooComponent,
            pathRegex: /^\/foo(?:\/)?$/i,
            dynamicSegments: []
        },
        // /bar/:id
        bar: {
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

        }
    };

    history.replaceState({}, 'bar', '/bar/123');

    const result = matchCurrentView(processedRoutes); // TEST

    expect(result).toEqual(BarComponent);
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
    history.replaceState({}, 'bar', '/xyz');

    // expecting Error to be thrown instead of NavigationError - because of limitations of Babel?
    // see https://github.com/facebook/jest/issues/2123
    expect(() => { matchCurrentView(processedRoutes) }).toThrow(Error); // TEST
});
