# Yet Another Vue Router #  

In order to understand how routing in single page applications works I tried to write a Vue router from scratch.  

## Usage ##  
### Static Routing ###  
```
// interface to be used when declaring routes
interface RouteObject {
    path: string
    component: object  
}  

<div id="app">
  <yet-another-router-outlet></yet-another-router-outlet>  
  <yet-another-router-link to="foo"></yet-another-router-link>
  <yet-another-router-link to="bar"></yet-another-router-link>
</div>

// example components
const FooComponent = { template: `<div>foo</div>`};
const BarComponent = { template: `<div>bar</div>`}; 

// you can declare your routes similary as done here:  
const routes: RouteObject[] = [
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
TODO 
### Route guards ###  
TODO    
### Programmatic navigation ###  
TODO
## Installation ##  
TODO  
