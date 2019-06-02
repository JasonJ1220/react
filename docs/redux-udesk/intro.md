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
（1）Web 应用是一个 state container，view 与 state 是一一对应的。
（2）所有的 state，保存在一个对象 (store) 里面。

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

#### Context API
1. Context API 的使用方法 

2. 使用场景

### you might not need Redux
“如果你不知道是否需要 Redux，那就是不需要它。”
Redux 的创造者 Dan Abramov 又补充了一句。
"只有遇到 React 实在解决不了的问题，你才需要 Redux 。"

### motivation
随着单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

state 在什么时候，由于什么原因，如何变化已然不受控制。 

Redux 试图让 state 的变化变得可预测。


### Three Principles
#### Single Source of Truth
- 传统MVC 做法

- Redux 做法

#### predictable
```
State + Action = new State
```

#### Changes are made with Pure Functions

## Store\Action\Reducer
### Store
- getState()
- dispatch(action)
- subscribe(listener)

### action
```
{ 
    type: 'DEPOSIT',
    value: 10
}
```
### reducer
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

## React-Redux

## Async Flow
### Async action
异步 action 不是特殊 action
而是多个同步 action 的组合使用 
### Redux Middleware
Redux 中间件（Middleware）
1. 截获action
2. 发出action
### Redux-Thunk
### Redux-Saga

## Immutability
### what

### why
1.性能优化
2.易于调试和跟踪
3.易于推测

### how


## 参考资料
- https://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/
- https://redux.js.org/
- https://css-tricks.com/learning-react-redux/
- https://github.com/supnate/react-geek-time
