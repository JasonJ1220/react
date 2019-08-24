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
let res = a( 1 )

// 实参传递
let b = function( a ) {
  return a(1) + 1
}

// 返回另一个函数
let c = function(a, cb){
  return function( c ) {
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
    this.seagulls = this.seagulls * other.seagulls;
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
// 32
```

## pure-function
纯函数：一个没有任何副作用，并且返回值只由输入决定的函数
我举2个例子:
- slice & splice：slice是一个纯函数，splice是非纯函数
- add
```
// add 的非纯函数定义
var x = 5;
function add( y ){ return y + x }

// 如何定义一个纯函数
function addPure( x ){
  return function ( y ) {
     return y + x
  }
};
```


## currying
```
// 柯里化
function addPure( x ){
  return function ( y ) {
     return y + x
  }
}

var addTemp = addPure(5)
var res = addTemp(1) // 6
var res1 = addTemp(10) // 15

// 非柯里化
function addPure( x, y ){
   return y + x
}

// 柯里化结合ES6

const add = x => y => x + y

// redux middlreware
const loggerMiddleware = store => next => action => {
  // do some thing.
}
```

## compose
- 当函数纯化之后，有一个很鲜明的特点是，这个函数变的可以组合了。我们可以像堆积木一样，把各个我们要用的函数堆起来变成一个更大得函数体。

### 嵌套
```
// 嵌套前　很清晰
const f = x => x +1
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

    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}

const demo = (composed, f) => {
  f(composed);
  return last(...args)
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
  console.log( y )
  return x(y)
}

// 调用
var a = highOrderFn(fn)
var b = a(2)() // 3

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

#### State Hook

#### Effect Hook

#### 原则
1. 只在最顶层使用 Hook
2. 不要在循环，条件或嵌套函数中调用 Hook
3. 只在 React 函数中调用 Hook
4. 不要在普通的 JavaScript 函数中调用 Hook

#### demo 
1. 使用hook 获取数据
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
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<SearchResults />, rootElement);
```



## 参考资料
[https://github.com/MostlyAdequate/mostly-adequate-guide](https://github.com/MostlyAdequate/mostly-adequate-guide)
[https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
[https://reactjs.org/](https://reactjs.org/)