# Yet Another Vue Router #  

In order to understand how routing in single page applications works `yet-another-vue-router` was written.  

## Usage ##  
### Static Routing ###  
```
// interface to be used when declaring routes
interface RouteDefinition {
    path: string
    component: object  
    beforeEnter?: (from: Route, to: Route, next: Function) => void
    beforeLeave?: (from: Route, to: Route, next: Function) => void
}  

<div id="app">
  <yet-another-router-view>  
  <yet-another-router-link to="foo"></yet-another-router-link>
  <yet-another-router-link to="bar"></yet-another-router-link>
</div>

// example components
const FooComponent = { template: `<div>foo</div>`};
const BarComponent = { template: `<div>bar</div>`}; 

// you can declare your routes similary as done here:  
const routes: RouteDefinition[] = [
    {
        path: '/foo',
        component: FooComponent
    },  
    {
        path: '/bar',
        component: BarComponent
    }
];  

const app = new Vue({
  el: '#app',
  data: {},
  created: function() {
    initRouter(routes);
  }  
});

```  

### Dynamic Routing ###  
Dynamic parts of path are passed into the component as props.
```
const routes = [
  {
    path: '/foo/:username',
    component: Foo,
  },
];
...
export default {
    name: 'Foo',
    props: ['username'],
}
```
### Route guards ###  
Two guards are available: beforeEnter and beforeLeave.  
Example usage can be seen below:  
```
const routes: RouteDefinition[] = [
    {
        path: '/foo',
        component: FooComponent
        beforeLeave: (from, to, next) => {
            if (to.path === '/bar') {
                alert('You can not navigate from /foo to /bar.');
                next(false)
            }
        }
    },  
    {
        path: '/bar',
        component: BarComponent
        beforeEnter: (from, to, next) => {
            if (from.path === '/foo') {
                alert('You can not navigate from /foo to /bar.');
                next(false);
            }
        }
    }
];  

```  
### Programmatic navigation ###  
```
this.$router.navigate('/foo');
```
### Named Views ###
You can declare named views as in example below:  
```
const routes: RouteDefinition[] = [
    {
        path: '/foo',
        components: {
            default: Foo
            side: Bar
        }
    },  
];  
```  
and use them in a following way:  
```
<yet-another-router-view></yet-another-router-view>
<yet-another-router-view name="side"></yet-another-router-view>
```
