# react-router
> https://reacttraining.com/react-router/

- Basic Routing:

```
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about/">About</Link>
          </li>
          <li>
            <Link to="/users/">Users</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={Index} />
      <Route path="/about/" component={About} />
      <Route path="/users/" component={Users} />
    </div>
  </Router>
);

export default AppRouter;
```
- Nested Routing

```
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <Header />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>;
const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>

    <ul>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.path}/:id`} component={Topic} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);
const Header = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/about">About</Link>
    </li>
    <li>
      <Link to="/topics">Topics</Link>
    </li>
  </ul>
);

export default App;
```


## Basic Components

### router components
#### HashRouter

如果你使用过react-router2或3或者vue-router，你经常会发现一个现象就是url中会有个#，例如localhost:3000/#，HashRouter就会出现这种情况，它是通过hash值来对路由进行控制。如果你使用HashRouter，你的路由就会默认有这个#。

#### BrowserRouter

很多情况下我们则不是这种情况，我们不需要这个#，因为它看起来很怪，这时我们就需要用到BrowserRouter。

它的原理是使用HTML5 history API (pushState, replaceState, popState)来使你的内容随着url动态改变的， 如果是个强迫症或者项目需要就选择BrowserRouter吧。下面我们将主要结合它来讲解。
这里讲一个它们的基础api，basename。如果你的文件放在服务器的二级目录下则可以使用它。

#### BrowserRouter&HashRouter 区别


### route matching components

#### Route
Route是Router的资源组件，它是控制路径对应显示的组件。我们经常用的是exact、path以及component属性。
exact控制匹配到/路径时不会再继续向下匹配，
path标识路由的路径，
component表示路径对应显示的组件。后面我们将结合NavLink完成一个很基本的路由使用。同时我们可以设置例如/second/:id的方式来控制页面的显示，这需要配合Link或者NavLink配合使用。下面我们会提到
```
<Route path='/about' component={About}/> // renders <About/>
<Route path='/contact' component={Contact}/> // renders null
<Route component={Always}/> // renders <Always/>
```
#### Switch
Switch常常会用来包裹Route，它里面不能放其他元素。它将遍历它的所有子元素Route，并且只呈现与当前位置匹配的第一个元素。
```
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/contact" component={Contact} />
</Switch>

<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/contact" component={Contact} />
  {/* when none of the above match, <NoMatch> will be rendered */}
  <Route component={NoMatch} />
</Switch>
```
### navigation components
### Link
Link 组件用于创建连接。 当渲染一个 Link 组件时, 一个锚点 (a) 将会被渲染到 HTML 中。
```
<Link to="/">Home</Link>
// <a href='/'>Home</a>
```

### NavLink
NavLink 是一个特殊的 Link , 当它被router匹配时，它将会触发 'active' 的样式。
```
// location = { pathname: '/react' }
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
// <a href='/react' className='hurray'>React</a>
```
### Redirect
任何时候，只要您想强制导航，您都可以呈现<Redirect>。当一个<Redirect>呈现时，它将使用其来导航。
```
<Redirect to="/login" />
```
### Prompt



