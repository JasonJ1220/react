# redux
> https://redux.js.org/

Redux is a predictable state container for JavaScript apps.

- overview
1. Basic Example
2. origin
3. Prior Art
4. you might not need Redux
5. motivation
6. Three Principles

- Store\Action\Reducer
1. Stroe
2. Action
3. Reducer
4. combineReducers
5. bindActionCreators
6. compose

- React-Redux
1. 在 React 中使用 Redux
2. connect 的工作原理高阶组件

- Async Flow
1. Async action
2. Redux Middleware
3. Redux-Thunk
4. Redux-Saga

- Immutability

- Redux structuring(TODO)

- 如何组织 Action 和 Reducer(TODO)

- 编写测试(TODO)

- 参考资料

## overview
Redux 的设计思想很简单。
1. Web 应用是一个 state container，view 与 state 是一一对应的。
2. 所有的 state，保存在一个对象 (store) 里面。

### Basic Example
```
import { createStore } from 'redux'

let store = createStore(counter)
store.subscribe(() => console.log(store.getState()))

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'DECREMENT' })
```
```
import React, { Component } from 'react';
 
const counter = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };
    case 'DECREMENT':
      return { value: state.value - 1 };
    default:
      return state;
  }
}
 
class Counter extends Component {
  state = counter(undefined, {});
  
  dispatch(action) {
    this.setState(prevState => counter(prevState, action));
  }
 
  increment = () => {
    this.dispatch({ type: 'INCREMENT' });
  };
 
  decrement = () => {
    this.dispatch({ type: 'DECREMENT' });
  };
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }

```


### origin

### Prior Art
#### flux
Redux 的灵感来源于 Flux 的几个重要特性。和 Flux 一样，Redux 规定，将模型的更新逻辑全部集中于一个特定的层（Flux 里的 store，Redux 里的 reducer）。Flux 和 Redux 都不允许程序直接修改数据，而是用一个叫作 “action” 的普通对象来对更改进行描述。

不同点:
1. Redux 并没有 dispatcher 的概念。
2. Redux 设想你永远不会变动你的数据。

redux吸收了flux的所有优点（记录并且重新执行action，单向的数据流，依赖变动）并且也加入了些新的（简易的undo-redo,hot-reloading）不需要引入新的dispatcher和store注册。 

#### Context API
1. 使用场景
Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。
Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。
2. Context API 的使用方法 
```
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Middle />
      </ThemeContext.Provider>
    );
  }
}


function Middle(props) {
  return (
    <div>
      <Children />
    </div>
  );
}

class Children extends React.Component {
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
  //or
  //render() {
  //  return (
  //	<ThemeContext.Consumer>
  //		{theme => <Button theme={theme} />}
  //	</ThemeContext.Consumer>);
  //}
}
```

### you might not need Redux
“如果你不知道是否需要 Redux，那就是不需要它。”

Redux 的创造者 Dan Abramov 又补充了一句。
"只有遇到 React 实在解决不了的问题，你才需要 Redux 。"

### motivation
随着单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

state 在什么时候，由于什么原因，如何变化已然不受控制。 

通过限制更新发生的时间和方式，Redux 试图让 state 的变化变得可预测。这些限制条件反映在 Redux 的三大原则中。

### Three Principles
#### Single Source of Truth
整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。
- 传统MVC 做法

- Redux 做法

#### predictable
State 是只读的, 唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
```
State + Action = new State
```

```
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

#### Changes are made with Pure Functions
纯函数:相同的输入，永远会得到相同的输出，而且没有任何显著的副作用。
副作用:在计算结果的过程中，系统状态的一种改变，或是外部世界可观察的交互作用。比如发送http请求等，只要与function外部环境发生交互作用的都是副作用。

## Store\Action\Reducer
### action
Action 是把数据从应用传到 store 的有效标识。它是 store 数据的唯一来源。通过 store.dispatch() 将 action 传到 store。
```
{ 
    type: 'DEPOSIT',
    value: 10
}
```
### reducer
reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

谨记 reducer 一定要保持纯净。只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。
```
function counter(state = 0, action) {
  switch (action.type) {
  case 'DEPOSIT':
    return state + action.value
  case 'WITHDRAW':
    return state - action.value
  default:
    return state
  }
}
```

### Store
Store 就是把reducers 和 action联系到一起的对象。

- getState()
- dispatch(action)
- subscribe(listener) //(返回一个函数用来注销监听器)


## React-Redux
### 在 React 中使用 Redux

### connect 的工作原理-高阶组件


## Async Flow
### Async action
异步 action 不是特殊 action
而是多个同步 action 的组合使用 
### Redux Middleware
Redux 中间件（Middleware）
1. 截获action
2. 发出action
### Redux-Thunk
#### generator
```
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```
#### generator 异步应用

### Redux-Saga

## Immutability
### what

### why
1.性能优化
2.易于调试和跟踪
3.易于推测

### how


## 参考资料
- https://medium.com/@dan_abramov/the-case-for-flux-379b7d1982c6
- https://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/
- https://redux.js.org/
- https://css-tricks.com/learning-react-redux/
- https://github.com/supnate/react-geek-time
