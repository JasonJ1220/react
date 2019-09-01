# functional programming
**内容：**
- about
- why-fp
- function-first-class
- a brief encounter
- pure-function
- currying
- compose
- higher-order-function
- point-free-style


## about
- 面向过程编程：以过程为中心的编程思想，想到什么写什么
- 面向对象编程：从数据结构的角度出发
1. 具有相同特性（数据元素）和行为（功能）的对象的抽象就是类
2. 对象的抽象是类，类的实例是对象
3. 类实际上就是一种数据类型
- 面向函数编程：从算法角度出发，也就是从行为的角度出发，体现的一些编程原则：
1. 不要重复自己（don't repeat yourself）
2. 高内聚低耦合（loose coupling high cohesion）
3. 最小意外原则（Principle of least surprise）
4. 单一责任（single responsibility）

## why-fp
为了更好的模块化
- 模块化使得开发更快、维护更容易
- 模块可以重用
- 模块化便于单元测试和debug

掌握函数式编程有助于更好的理解和使用Rxjs、Redux等一些前端类库和框架

## function-first-class
- 函数可以赋值给变量
- 函数可以被作为实参传递
- 函数可以作为形参
- 函数可以被另一个函数返回
- 函数可以返回另一个函数

```
// 定义
let a = function(x){ return x + 1 }

// 赋值
let res = a(1)

// 实参传递
let b = function(a) {
  return a(1) + 1
}

// 返回另一个函数
let c = function(a, cb){
  return function(c) {
    cb()
    return c + 2
  }
}

function cb(){ }
```

## A Brief Encounter
```
class Flock {
  constructor(n) {
    this.seagulls = n;
  }

  conjoin(other) {
    this.seagulls += other.seagulls;
    return this;
  }

  breed(other) {
    this.seagulls *= other.seagulls;
    return this;
  }
}

const flockA = new Flock(4);
const flockB = new Flock(2);
const flockC = new Flock(0);
const result = flockA
  .conjoin(flockC)
  .breed(flockB)
  .conjoin(flockA.breed(flockB))
  .seagulls;
```

----------

```
const conjoin = (flockX, flockY) => flockX + flockY;
const breed = (flockX, flockY) => flockX * flockY;

const flockA = 4;
const flockB = 2;
const flockC = 0;
const result =
    conjoin(breed(flockB, conjoin(flockA, flockC)), breed(flockA, flockB));
// 16
```

## pure-function
纯函数：一个没有任何副作用，并且返回值只由输入决定的函数
我举2个例子:
- slice & splice：slice是一个纯函数，splice是非纯函数
- add

```
// add 的非纯函数定义
var x = 5;
function add(y){ return y + x }

// 如何定义一个纯函数
function addPure(x){
  return function (y) {
    return y + x;
  }
};
```

## currying
```
// 柯里化
function addPure(x){
  return function (y) {
     return y + x;
  }
}

var addTemp = addPure(5)
var res = addTemp(1) // 6
var res1 = addTemp(10) // 15

// 非柯里化
function addPure(x, y){
   return y + x
}

// 柯里化结合ES6

const add = x => y => x + y

// redux middlreware
const loggerMiddleware = store => next => action => {
  // do some thing.
}
```
react中的 currying :
```
//柯里化的组件
class Filters extends React.Component {
  
  updateSelections = (selectionType) => {
    return (newValue) => {
      this.props.selectionsChanged({
        ...this.props.selections,
        [selectionType]: newValue,  // new ES6 Syntax!! :)
      });
    }
  };

  render() {
    return (
      <div>
        <PriceFilter 
          price={this.props.selections.price} 
          priceChanged={this.updateSelections('price')} 
        />
        <AgeFilter 
          ages={this.props.selections.ages} 
          agesChanged={this.updateSelections('ages')} 
        />
        <BrandFilter 
          brands={this.props.selections.brands} 
          brandsChanged={this.updateSelections('brands')} 
        />
      </div>
    );
  };
}


//非柯里化实现
class Filters extends React.Component {
  updateSelections = (selectionType, newValue) => {
    this.props.selectionsChanged({
      ...this.props.filterSelections,
      [selectionType]: newValue, 
    });
  };

  render() {
    return (
      <div>
        <PriceFilter   
          price={this.props.selections.price} 
          priceChanged={(value) => this.updateSelections('price', value)} 
        />
        <AgeFilter 
          ages={this.props.selections.ages} 
          agesChanged={(value) => this.updateSelections('ages', value)} 
        />
        <BrandFilter 
          brands={this.props.selections.brands} 
          brandsChanged={(value) => this.updateSelections('brands', value)} 
        />
      </div>
    );
  };
}
```

## compose
- 当函数纯化之后，有一个很鲜明的特点是，这个函数变的可以组合了。我们可以像堆积木一样，把各个我们要用的函数堆起来变成一个更大得函数体。

### 嵌套
```
// 嵌套前　很清晰
const f = x => x + 1
const g = x => x + 2
const h = x => x + 3
//　嵌套后
var a = h(g(f(x)));
```

### 定义compose函数实现函数的组合使用
```
// 简易compose函数的定义
var compose = function(f, g) {
    return function(x) {
        return f(g(x));
    };
};

// 或者使用es6的箭头函数定义compose
var compose = (f, g) => x => f(g(x));

var add = x => x + 1;
var multiple = x => x * 5;

var m = compose(multiple, add)(2);
// add出来的结果：3
// multiple出来的结果：15

// 如果没有compose组合
var n = mutilpe(add(2))
var a = multiple(add(add1(add2(add3(2)))))
```

redux compose源码:
```
/*
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg；
  }

  if (funcs.length === 1) {
    return funcs[0]；
  }

  const last = funcs[funcs.length - 1]；
  const rest = funcs.slice(0, -1)；
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))；
}

compose(fn1, fn2, fn3)();
```

redux调用compose:
```
// applyMiddleware.js
dispatch = compose(...chain)(store.dispatch)
```

## higher-order-function
```
const fn = x => x + 1

// es6
const highOrderFn = x => y => {
  console.log(y);
  return x(y);
}

// 调用
var a = highOrderFn(fn)
var b = a(2)(); // 3

```

react中的高阶组件

```
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```
其他高阶函数例子：
```
const NavbarWithRouter = withRouter(Navbar);

// React Redux 的 `connect` 函数
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```


## React世界的函数式编程
### redux
参考之上

### react hook
Hook 是什么？ Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。

什么时候我会用 Hook？ 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以在现有的函数组件中使用 Hook。
```
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```


#### State Hook
- React 怎么知道 useState 对应的是哪个 state?
- React 是如何把对 Hook 的调用和组件联系起来的？
- 函数式更新(与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果。或者使用 useReducer )

使用 Hook 的示例:
```
import React, { useState } from 'react';
function Example() {
  const [count, setCount] = useState(0);
  // 声明多个 state 变量
  // const [age, setAge] = useState(42);
  // const [fruit, setFruit] = useState('banana');
  // const [todos, setTodos] = useState([{ text: '学习 Hook' }]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
       Click me
     </button>
    </div>
  );
}
```

#### Effect Hook

- 使用 Hook 的示例:

```
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

- 为什么在组件内部调用 useEffect？ 
- useEffect 会在每次渲染后都执行吗？
- effect 的执行时机
- effect 的条件执行（请确保数组中包含了所有外部作用域中会发生变化且在 effect 中使用的变量）
- 使用多个 Effect 实现关注点分离（Hook 允许我们按照代码的用途分离他们，使用 Hook 其中一个目的就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。）

```
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  //如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。
  [props.source]
);
```

#### Ref Hook
```
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    <div/>
  );
}
```

#### useLayoutEffect
其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。
与 useEffect 区别:
```
import React, { useEffect, useLayoutEffect, useRef } from "react";

const Animate = () => {
    const divRel = useRef(null);
    // useLayoutEffect　直接就是蓝色　
    //　useEffect 则由红色变蓝色
    useEffect(() => {
        divRel.current.style.backgroundColor='blue';
    }, []);
    return (
        <div className='animate'>
            <div ref={divRel} style={width:'300px',height:'300px',backgroundColor:'red'}>square</div>
        </div>
    );
};

export default Animate;
```

#### 原则
1. 只在最顶层使用 Hook(不要在循环，条件或嵌套函数中调用 Hook)
2. 只在 React 函数中调用 Hook(不要在普通的 JavaScript 函数中调用 Hook)

### 从　class 到　hook
#### constructor
函数组件不需要构造函数。你可以通过调用 useState 来初始化 state。如果计算的代价比较昂贵，你可以传一个函数给 useState。

#### getDerivedStateFromProps

#### shouldComponentUpdate
```
const Button = React.memo((props) => {
  // 只它的 props 进行浅比较
},(prevProps, nextProps)=>{

});
```
#### render
函数本身

#### force update
```
const useForceUpdate = () => {
  const forceUpdate = useState(0)[1];
  return () => forceUpdate(x => x + 1);
}
```

#### getSnapshotBeforeUpdate
hook不能直接替代这个生命周期，可利用useLayoutEffect 和 useEffect 组合实现。

#### componentDidMount, componentDidUpdate, componentWillUnmount
useEffect Hook 可以表达所有这些的组合。

#### componentDidCatch, getDerivedStateFromError
目前还未实现

#### demo 
- 使用hook 获取数据

```
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';

function SearchResults() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('react');

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const result = await axios('https://hn.algolia.com/api/v1/search?query=' + query);
      if (!ignore) setData(result.data);
    }

    fetchData();
    return () => { ignore = true; }
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    <div/>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<SearchResults />, rootElement);
```

## 参考资料
[https://github.com/MostlyAdequate/mostly-adequate-guide](https://github.com/MostlyAdequate/mostly-adequate-guide)
[https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
[https://reactjs.org/](https://reactjs.org/)