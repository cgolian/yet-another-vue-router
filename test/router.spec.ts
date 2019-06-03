import { processedRoutes, processRoutes } from '../src/router';
import { RouteObject } from '../src/models';

afterEach(() => {
    Object.keys(processedRoutes).forEach(function (key) {
        delete processedRoutes[key];
    });
});

test('Should process static route.', () => {
    const FooComponent = { template: `<div>foo</div>`};
    const routes: RouteObject[] = [
        {
            path: '/foo',
            component: FooComponent
        }
    ];

    expect(processedRoutes).toEqual({});

    processRoutes(routes); // TEST

    expect(processedRoutes).toBeDefined();
    expect(Object.keys(processedRoutes).length).toEqual(1);

    expect(processedRoutes[routes[0].path]).toBeDefined();
    expect(processedRoutes[routes[0].path].path).toEqual(routes[0].path);
    expect(processedRoutes[routes[0].path].pathRegex).toEqual(/^\/foo(?:\/)?$/i);
    expect(processedRoutes[routes[0].path].component).toEqual(routes[0].component);
    expect(processedRoutes[routes[0].path].dynamicSegments).toEqual([]);
});

test('Should process dynamic route', () => {
    const BarComponent = { template: `<div>bar</div>`};
    const routes: RouteObject[] = [
        {
            path: '/bar/:id',
            component: BarComponent
        }
    ];

    expect(processedRoutes).toEqual({});

    processRoutes(routes); // TEST

    expect(processedRoutes).toBeDefined();
    expect(Object.keys(processedRoutes).length).toEqual(1);

    expect(processedRoutes[routes[0].path]).toBeDefined();
    expect(processedRoutes[routes[0].path].path).toEqual(routes[0].path);
    expect(processedRoutes[routes[0].path].pathRegex).toEqual(/^\/bar\/([^\/]+?)(?:\/)?$/i);
    expect(processedRoutes[routes[0].path].component).toEqual(routes[0].component);
    expect(processedRoutes[routes[0].path].dynamicSegments).toBeDefined();
    expect(processedRoutes[routes[0].path].dynamicSegments.length).toEqual(1);
});
