# redux
> https://redux.js.org/

## Basic
Redux is a predictable state container for JavaScript apps.
### Basic Example
应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。 惟一改变 state 的办法是触发 action，一个描述发生什么的对象。 为了描述 action 如何改变 state 树，你需要编写 reducers。
```
import { createStore } from 'redux'

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
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

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.subscribe(() => console.log(store.getState()))

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```
你应该把要做的修改变成一个普通对象，这个对象被叫做 action，而不是直接修改 state。然后编写专门的函数来决定每个 action 如何改变应用的 state，这个函数被叫做 reducer。

### Motivation
随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。

这里的复杂性很大程度上来自于：我们总是将两个难以理清的概念混淆在一起：变化和异步。 如果把二者分开，能做的很好，但混到一起，就变得一团糟。一些库如 React 试图在视图层禁止异步和直接操作 DOM 来解决这个问题。美中不足的是，React 依旧把处理 state 中数据的问题留给了你。Redux就是为了帮你解决这个问题。


### 核心概念
- state
当使用普通对象来描述应用的 `state` 时。例如，todo 应用的 `state` 可能长这样：
```
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```
- action
要想更新 state 中的数据，你需要发起一个 `action`。`action` 就是一个普通 JavaScript 对象用来描述发生了什么。下面是一些 `Action` 的示例：
```
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

- reducer
强制使用 `action` 来描述所有变化带来的好处是可以清晰地知道应用中到底发生了什么。如果一些东西改变了，就可以知道为什么变。`action` 就像是描述发生了什么的指示器。最终，为了把 `action` 和 `state` 串起来，开发一些函数，这就是 `reducer`。`reducer` 只是一个接收 `state` 和 `action`，并返回新的 `state` 的函数。 对于大的应用来说，不大可能仅仅只写一个这样的函数，所以我们编写很多小函数来分别管理 state 的一部分：
```
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter;
  } else {
    return state;
  }
}
function todos(state = [], action) {
  switch (action.type) {
  case 'ADD_TODO':
    return state.concat([{ text: action.text, completed: false }]);
  case 'TOGGLE_TODO':
    return state.map((todo, index) =>
      action.index === index ?
        { text: todo.text, completed: !todo.completed } :
        todo
   )
  default:
    return state;
  }
}
```

- root reducer
再开发一个`root reducer` 调用这两个 `reducer`，进而来管理整个应用的 `state`：
```
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}
```

### Three Principles
#### 单一数据源
整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 `store` 中。

这让同构应用开发变得非常容易。来自服务端的 state 可以在无需编写更多代码的情况下被序列化并注入到客户端中。由于是单一的 state tree ，调试也变得非常容易。在开发中，你可以把应用的 `state` 保存在本地，从而加快开发速度。此外，受益于单一的 state tree ，以前难以实现的如“撤销/重做”这类功能也变得轻而易举。
```
console.log(store.getState())

/* 输出
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*／
```
#### State 只读
唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

这样确保了视图和网络请求都不能直接修改 state，相反它们只能表达想要修改的意图。因为所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，因此不用担心 race condition 的出现。 Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。
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
#### 使用纯函数来执行修改
为了描述 `action` 如何改变 state tree ，你需要编写 `reducer`s。

Reducer 只是一些纯函数，它接收先前的 `state` 和 `action`，并返回新的 `state`。刚开始你可以只有一个 `reducer`，随着应用变大，你可以把它拆成多个小的 `reducer`s，分别独立地操作 state tree 的不同部分，因为 `reducer` 只是函数，你可以控制它们被调用的顺序，传入附加数据，甚至编写可复用的 `reducer` 来处理一些通用任务，如分页器。

```
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux';
let reducer = combineReducers({ visibilityFilter, todos });
let store = createStore(reducer);
```

> 什么是纯函数
**一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数。**
- 相同输入总是会返回相同的输出。
- 不产生副作用（不修改传入参数）。
- 不依赖于外部状态（不使用其他外部方法）。

> pure
```
function square(x) {
  return x * x;
}
function squareAll(items) {
  return items.map(square);
}
```
> impure
```
function square(x) {
  updateXInDatabase(x);
  return x * x;
}
function squareAll(items) {
  for (let i = 0; i < items.length; i++) {
    items[i] = square(items[i]);
  }
}
```

### Actions
`action` 是把数据从应用传到 `store` 的有效载荷。它是 `store` 数据的唯一来源。一般来说你会通过 store.dispatch() 将 `action` 传到 `store`。
- action
一个约定俗成的做法是，将 action types 定义为常量字符串，另一个约定俗成的做法是通过创建函数生成 action 对象，而不是在你 dispatch 的时候内联生成它们。
```
/*
 * action 类型
 */
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
/*
 * 其它的常量
 */
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
/*
 * action 创建函数
 */
export function addTodo(text) {
  return { type: ADD_TODO, text }
}
export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}
export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
// 用于生成 action creator 的函数 可用其他库 如redux-actions 减少样本代码
function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}
```

- 异步 Action
```
/**
 * Sample Async Action namely: the thunk
 * 要配合redux-thunk这个middleware一起使用
 * ref: https://github.com/gaearon/redux-thunk
 */
export const loadMoreWorkAsync = () => dispatch => {
  /* 1. fetch之前，可以先发个pending的action */
  dispatch({
    type: LOAD_MORE_WORK,
    msg: 'pending',
  });
  fetch('imgs/test.json').then(resp => {
      // console.log('[resp]', resp.status);
    if (resp.status === 200) return resp.json();
    throw new Error('not 200 this time'); // 美滴很
  }).then(json => {
    /* 2. 异步结束了，发结果action */
    dispatch({
      type: LOAD_MORE_WORK,
      msg: json.name,
    });
  }).catch(error => {
    /* 3. 发报错action */
    dispatch({
      type: LOAD_MORE_WORK,
      msg: error,
    });
  });
};
```

### Reducers
Reducers 指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。

注意2个原则：
1. 不要修改 state。 
1. 在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state。
```
const commonInitialState = {
};
const commonReducer = (state=commonInitialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
export default commonReducer;
```
### Store
Store 就是把Action和Reducer联系到一起的对象。Store 有以下职责：
- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。

**Redux 应用只有一个单一的 store。**
```
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```