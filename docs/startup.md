# 简介
# 快速上手

# 入门篇
## 开发环境
基础环境必须依赖nodejs和npm,未安装的可以去官网自行安装，安装教程这里不详细说明，安装完成后使用如下命令，查看是否安装成功。
```
node -v
npm -v
```

## 安装

## 设置

## 技能
### JavaScript
#### 变量声明
**const 和 let**
不要用 var，而是用 const 和 let，分别表示常量和变量。不同于 var 的函数作用域，const 和 let 都是块级作用域。
```
const DELAY = 1000;
let count = 0;
count = count + 1;
```
**模板字符串**
模板字符串提供了另一种做字符串组合的方法。
```
const user = 'world';
console.log(`hello ${user}`);  // hello world

// 多行
const content = `
  Hello ${firstName},
  Thanks for ordering ${qty} tickets to ${event}.
`;
```
**默认参数**
```
function logActivity(activity = 'skiing') {
  console.log(activity);
}

logActivity();  // skiing
```

#### 箭头函数
函数的快捷写法，不需要通过 function 关键字创建函数，并且还可以省略 return 关键字。
同时，箭头函数还会继承当前上下文的 this 关键字。
```
[1, 2, 3].map(x => x + 1);  // [2, 3, 4]
// 等同于
[1, 2, 3].map((function(x) {
  return x + 1;
}).bind(this));
```

#### Import 和 Export
import 用于引入模块，export 用于导出模块。
```
// 引入全部
import dva from 'dva';

// 引入部分
import { connect } from 'dva';
import { Link, Route } from 'dva/router';

// 引入全部并作为 github 对象
import * as github from './services/github';

// 导出默认
export default App;
// 部分导出，需 import { App } from './file'; 引入
export class App extend Component {};
```

#### ES6 对象和数组
**析构赋值**
析构赋值让我们从 Object 或 Array 里取部分数据存为变量。
```
// 对象
const user = { name: 'guanguan', age: 2 };
const { name, age } = user;
console.log(`${name} : ${age}`);  // guanguan : 2

// 数组
const arr = [1, 2];
const [foo, bar] = arr;
console.log(foo);  // 1
```
我们也可以析构传入的函数参数。
```
const add = (state, { payload }) => {
  return state.concat(payload);
};
```
析构时还可以配 alias，让代码更具有语义。
```
const add = (state, { payload: todo }) => {
  return state.concat(todo);
};
```
**对象字面量简写**
这是析构的反向操作，用于重新组织一个 Object 。
```
const name = 'duoduo';
const age = 8;
const user = { name, age };  // { name: 'duoduo', age: 8 }
```
定义对象方法时，还可以省去 function 关键字。
```
app.model({
  reducers: {
    add() {}  // 等同于 add: function() {}
  },
  effects: {
    *addRemote() {}  // 等同于 addRemote: function*() {}
  },
});
```
**rest参数**
Spread Operator 即 3 个点 ...，有几种不同的使用方法。
可用于组装数组。
```
const todos = ['Learn dva'];
[...todos, 'Learn antd'];  // ['Learn dva', 'Learn antd']
```
也可用于获取数组的部分项。
```
const arr = ['a', 'b', 'c'];
const [first, ...rest] = arr;
rest;  // ['b', 'c']

// With ignore
const [first, , ...rest] = arr;
rest;  // ['c']
```
还可收集函数参数为数组。
```
function directions(first, ...rest) {
  console.log(rest);
}
directions('a', 'b', 'c');  // ['b', 'c'];
```
代替apply
```
function foo(x, y, z) {}
const args = [1,2,3];

// 下面两句效果相同
foo.apply(null, args);
foo(...args);
```
对于 Object 而言，用于组合成新的 Object 。
```
const foo = {
  a: 1,
  b: 2,
};
const bar = {
  b: 3,
  c: 2,
};
const d = 4;

const ret = { ...foo, ...bar, d };  // { a:1, b:3, c:2, d:4 }
```
#### Promises
Promise 用于更优雅地处理异步请求。比如发起异步请求：
```
fetch('/api/todos')
  .then(res => res.json())
  .then(data => ({ data }))
  .catch(err => ({ err }));
```
定义 Promise 。
```
const delay = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
delay(1000).then(_ => {
  console.log('executed');
});
```

#### Generators
effects 是通过 generator 组织的。Generator 返回的是迭代器，通过 yield 关键字实现暂停功能。
这是一个典型的 effect，通过 yield 把异步逻辑通过同步的方式组织起来。
```
app.model({
  namespace: 'todos',
  effects: {
    *addRemote({ payload: todo }, { put, call }) {
      yield call(addTodo, todo);
      yield put({ type: 'add', payload: todo });
    },
  },
});
```
### React
#### Stateless Functional Components
React Component 有 3 种定义方式，分别是 React.createClass, class 和 Stateless Functional Component。推荐尽量使用最后一种，保持简洁和无状态。这是函数，不是 Object，没有 this 作用域，是 pure function。

比如定义 App Component 。
```
function App(props) {
  function handleClick() {
    props.dispatch({ type: 'app/create' });
  }
  return <div onClick={handleClick}>${props.name}</div>
}
\\ 等同于：
class App extends React.Component {
  handleClick() {
    this.props.dispatch({ type: 'app/create' });
  }
  render() {
    return <div onClick={this.handleClick.bind(this)}>${this.props.name}</div>
  }
}
```
#### JSX
**Component 嵌套**
类似 HTML，JSX 里可以给组件添加子组件。
```
<App>
  <Header />
  <MainContent />
  <Footer />
</App>
```
**className**
class 是关键字，所以添加样式时，需用 className 代替 class 。
```
<h1 className="fancy">Hello dva</h1>
```
**JavaScript 表达式**
JavaScript 表达式需要用 {} 括起来，会执行并返回结果。
比如：
```
<h1>{ this.props.title }</h1>
```

**Mapping Arrays to JSX**
可以把数组映射为 JSX 元素列表。
```
<ul>
  { this.props.todos.map((todo, i) => <li key={i}>{todo}</li>) }
</ul>
```
#### 注释
尽量别用 // 做单行注释。
```
<h1>
  {/* multiline comment */}
  {/*
    multi
    line
    comment
    */}
  {
    // single line
  }
  Hello
</h1>
```
#### Spread Attributes
这是 JSX 从 ECMAScript6 借鉴过来的很有用的特性，用于扩充组件 props 。
比如：
```
const attrs = {
  href: 'http://example.org',
  target: '_blank',
};
<a {...attrs}>Hello</a>
//等同于
const attrs = {
  href: 'http://example.org',
  target: '_blank',
};
<a href={attrs.href} target={attrs.target}>Hello</a>
```
#### Props
数据处理在 React 中是非常重要的概念之一，分别可以通过 props, state 和 context 来处理数据。而在 dva 应用里，你只需关心 props 。
**propTypes**
JavaScript 是弱类型语言，所以请尽量声明 propTypes 对 props 进行校验，以减少不必要的问题。
```
function App(props) {
  return <div>{props.name}</div>;
}
App.propTypes = {
  name: PropTypes.string.isRequired,
};
```
内置的 prop type 有：
- PropTypes.array
- PropTypes.bool
- PropTypes.func
- PropTypes.number
- PropTypes.object
- PropTypes.string

往下传数据:
![](https://zos.alipayobjects.com/rmsportal/NAzeMyUoPMqxfRv.png)
往上传数据:
![](https://zos.alipayobjects.com/rmsportal/fiKKgDGuEJfSvxv.png)
#### CSS Modules
**理解 CSS Modules。**
button class 在构建之后会被重命名为 ProductList_button_1FU0u 。button 是 local name，而 ProductList_button_1FU0u 是 global name 。你可以用简短的描述性名字，而不需要关心命名冲突问题。
然后你要做的全部事情就是在 css/less 文件里写 .button {...}，并在组件里通过 styles.button 来引用它。
![](https://zos.alipayobjects.com/rmsportal/SWBwWTbZKqxwEPq.png)

**定义全局 CSS**
CSS Modules 默认是局部作用域的，想要声明一个全局规则，可用 :global 语法。
```
.title {
  color: red;
}
:global(.title) {
  color: green;
}
```
然后在引用的时候：
```
<App className={styles.title} /> // red
<App className="title" />        // green
```

**classnames Package**
在一些复杂的场景中，一个元素可能对应多个 className，而每个 className 又基于一些条件来决定是否出现。这时，classnames 这个库就非常有用。
```
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
// lots of arguments of various types
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
// other falsy values are just ignored
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

不使用classnames：
```
var Button = React.createClass({
  // ...
  render () {
    var btnClass = 'btn';
    if (this.state.isPressed) btnClass += ' btn-pressed';
    else if (this.state.isHovered) btnClass += ' btn-over';
    return <button className={btnClass}>{this.props.label}</button>;
  }
});
```
使用之后:
```
var classNames = require('classnames');
 
var Button = React.createClass({
  // ...
  render () {
    var btnClass = classNames({
      btn: true,
      'btn-pressed': this.state.isPressed,
      'btn-over': !this.state.isPressed && this.state.isHovered
    });
    return <button className={btnClass}>{this.props.label}</button>;
  }
});
```
### Reducer
reducer 是一个函数，接受 state 和 action，返回老的或新的 state 。即：(state, action) => state
#### 增删改
```
app.model({
  namespace: 'todos',
  state: [],
  reducers: {
    add(state, { payload: todo }) {
      return state.concat(todo);
    },
    remove(state, { payload: id }) {
      return state.filter(todo => todo.id !== id);
    },
    update(state, { payload: updatedTodo }) {
      return state.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...todo, ...updatedTodo };
        } else {
          return todo;
        }
      });
    },
  },
};
```
#### 嵌套数据的增删改
建议最多一层嵌套，以保持 state 的扁平化，深层嵌套会让 reducer 很难写和难以维护。
```
app.model({
  namespace: 'app',
  state: {
    todos: [],
    loading: false,
  },
  reducers: {
    add(state, { payload: todo }) {
      const todos = state.todos.concat(todo);
      return { ...state, todos };
    },
  },
});
```
下面是深层嵌套的`例子，应尽量避免。
```
app.model({
  namespace: 'app',
  state: {
    a: {
      b: {
        todos: [],
        loading: false,
      },
    },
  },
  reducers: {
    add(state, { payload: todo }) {
      const todos = state.a.b.todos.concat(todo);
      const b = { ...state.a.b, todos };
      const a = { ...state.a, b };
      return { ...state, a };
    },
  },
});
```
### Effect
#### put
发出一个 Action，类似于 dispatch。

    yield put({ type: 'todos/add', payload: 'Learn Dva' });

#### call
用于调用异步逻辑，支持 promise 。

    const result = yield call(fetch, '/todos');

#### select
用于从 state 里获取数据。

    const todos = yield select(state => state.todos);

#### 错误处理
**全局错误**
effects 和 subscriptions 的抛错全部会走 onError hook，所以可以在 onError 里统一处理错误。
```
const app = dva({
  onError(e, dispatch) {
    console.log(e.message);
  },
});
```

**本地错误**
如果需要对某些 effects 的错误进行特殊处理，需要在 effect 内部加 try catch 。
```
app.model({
  effects: {
    *addRemote() {
      try {
        // Your Code Here
      } catch(e) {
        console.log(e.message);
      }
    },
  },
});
```

#### 异步请求
异步请求基于 whatwg-fetch，API 详见：https://github.com/github/fetch
**GET 和 POST**
```
import request from '../util/request';

// GET
request('/api/todos');

// POST
request('/api/todos', {
  method: 'POST',
  body: JSON.stringify({ a: 1 }),
});
```
**统一错误处理**
假如约定后台返回以下格式时，做统一的错误处理。
```
{
  status: 'error',
  message: '',
}
```
编辑 utils/request.js，加入以下中间件：
```
function parseErrorMessage({ data }) {
  const { status, message } = data;
  if (status === 'error') {
    throw new Error(message);
  }
  return { data };
}
```
然后，这类错误就会走到 onError hook 里。

### Subscription
subscriptions 是订阅，用于订阅一个数据源，然后根据需要 dispatch 相应的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。格式为 ({ dispatch, history }) => unsubscribe
#### 异步数据初始化
比如：当用户进入 /users 页面时，触发 action users/fetch 加载用户数据。
```
app.model({
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'users/fetch',
          });
        }
      });
    },
  },
});
```

#### path-to-regexp Package
如果 url 规则比较复杂，比如 /users/:userId/search，那么匹配和 userId 的获取都会比较麻烦。这时推荐用 path-to-regexp 简化这部分逻辑。
> https://github.com/pillarjs/path-to-regexp

```
import pathToRegexp from 'path-to-regexp';

// in subscription
const match = pathToRegexp('/users/:userId/search').exec(pathname);
if (match) {
  const userId = match[1];
  // dispatch action with userId
}
```

**Injected Props (e.g. location)**
Route Component 会有额外的 props 用以获取路由信息。
- location
- params
- children

#### 基于 action 进行页面跳转
```
import { routerRedux } from 'dva/router';

// Inside Effects
yield put(routerRedux.push('/logout'));

// Outside Effects
dispatch(routerRedux.push('/logout'));

// With query
routerRedux.push({
  pathname: '/logout',
  query: {
    page: 2,
  },
});
```

### Router
#### Route Components
Route Components 是指 ./src/routes/ 目录下的文件，他们是 ./src/router.js 里匹配的 Component。

**通过 connect 绑定数据**
```
import { connect } from 'dva';
function App() {}

function mapStateToProps(state, ownProps) {
  return {
    users: state.users,
  };
}
export default connect(mapStateToProps)(App);
```
然后在 App 里就有了 dispatch 和 users 两个属性。




## 重要概念
### pure function
- 函数的返回结果只依赖于它的参数。
- 函数执行过程里面没有副作用。

```
//纯函数的第一个条件：一个函数的返回结果只依赖于它的参数。
//非纯函数
const a = 1
const foo = (b) => a + b
foo(2) // => 3

//纯函数
const a = 1
const foo = (x, b) => x + b
foo(1, 2) // => 3

//纯函数的第二个条件：函数执行过程没有副作用 

//一个纯函数
const a = 1
const foo = (obj, b) => {
  return obj.x + b
}
const counter = { x: 1 }
foo(counter, 2) // => 3
counter.x // => 1

//修改为非纯函数
const a = 1
const foo = (obj, b) => {
  obj.x = 2
  return obj.x + b
}
const counter = { x: 1 }
foo(counter, 2) // => 4
counter.x // => 2

//将obj变为内部变量，纯函数
const foo = (b) => {
  const obj = { x: 1 }
  obj.x = 2
  return obj.x + b
}
```
一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数。

为什么要煞费苦心地构建纯函数？因为纯函数非常“靠谱”，执行一个纯函数你不用担心它会干什么坏事，它不会产生不可预料的行为，也不会对外部产生影响。不管何时何地，你给它什么它就会乖乖地吐出什么。如果你的应用程序大多数函数都是由纯函数组成，那么你的程序测试、调试起来会非常方便。
### 异步编程
异步编程的方法，大概有下面四种。
**回调函数**
```
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```
**事件监听**
**发布/订阅**
**Promise 对象**
```
var readFile = require('fs-readfile-promise');
readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})
.then(function (data) {
  console.log(data.toString());
})
.catch(function (err) {
  console.log(err);
});
```

### Generator
**暂停执行和恢复执行**
Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。
整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。Generator 函数的执行方法如下。
```
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

**函数体内外的数据交换**
next返回值的 value 属性，是 Generator 函数向外输出数据；next方法还可以接受参数，向 Generator 函数体内输入数据。
```
function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true }
```
上面代码中，第一个next方法的value属性，返回表达式x + 2的值3。第二个next方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的变量y接收。因此，这一步的value属性，返回的就是2（变量y的值）。

**错误处理**
Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。
```
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw('出错了');
// 出错了
```
上面代码的最后一行，Generator 函数体外，使用指针对象的throw方法抛出的错误，可以被函数体内的try...catch代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

**封装异步任务**
```
var fetch = require('node-fetch');
function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
```
执行任务
```
var g = gen();
var result = g.next();
result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

### Thunk 函数 
Thunk 函数是自动执行 Generator 函数的一种方法。Thunk是“传名调用”的一种实现策略，用来替换某个表达式。
```
function f(m) {
  return m * 2;
}
f(x + 5);
// 等同于
var thunk = function () {
  return x + 5;
};
function f(thunk) {
  return thunk() * 2;
}
```
在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
```
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```
一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。
任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。下面是一个简单的 Thunk 函数转换器。
```
// ES5版本
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6版本
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```
例子：
```
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);

function f(a, cb) {
  cb(a);
}
const ft = Thunk(f);
ft(1)(console.log) // 1
```
**Thunk 函数 有什么用？**
Thunk 函数现在可以用于 Generator 函数的自动流程管理。
执行同步Generator函数：
```
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
```
如果必须保证前一步执行完，才能执行后一步，上面的自动执行就不可行。这时，Thunk 函数就能派上用处。以读取文件为例。下面的 Generator 函数封装了两个异步操作。
```
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```
yield将方法的执行权移出了 Generator 函数，么就需要一种方法，将执行权再交还给 Generator 函数。这种方法就是 Thunk 函数，因为它可以在回调函数里，将执行权交还给 Generator 函数。
```
var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```
Thunk 函数的 Generator 执行器
```
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```
有了这个执行器，执行 Generator 函数方便多了。不管内部有多少个异步操作，直接把 Generator 函数传入run函数即可。当然，前提是每一个异步操作，都要是 Thunk 函数，也就是说，跟在yield命令后面的必须是 Thunk 函数。
```
var g = function* (){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);
```

## 场景举例
### 组件间通信
- 基本代码
```
class Son extends React.Component {
    render() {
        return <input/>;
    }
}
class Father extends React.Component {
    render() {
        return (<div>
            <Son/>
            <p>这里显示 Son 组件的内容</p>
        </div>);
    }
}
ReactDOM.render(<Father/>, mountNode);
```
- 通信代码
```
class Son extends React.Component {
  render() {
    return <input onChange={this.props.onChange}/>;
  }
}
class Father extends React.Component {
  constructor() {
    super();
    this.state = {
      son: ""
    }
  }
  changeHandler(e) {
    this.setState({
      son: e.target.value
    });
  }
  render() {
    return <div>
      <Son onChange={this.changeHandler.bind(this)}/>
      <p>这里显示 Son 组件的内容：{this.state.son}</p>
    </div>;
  }
}
ReactDOM.render(<Father/>, mountNode);
```


# 参考资料
- **basic**
[ES6](http://es6.ruanyifeng.com/) | ★★★★★

- **react**
[React](https://reactjs.org/) | ★★★★
[Redux](https://redux.js.org/) | ★★★★
[React-Redux](https://cn.redux.js.org/docs/react-redux/) | ★★★★
[react-router](https://reacttraining.com/react-router/) | ★★★★
[immutable](http://facebook.github.io/immutable-js/) | ★★★★★
[redux-saga](https://redux-saga-in-chinese.js.org/) | ★★★★
[prop-types](https://github.com/facebook/prop-types) | ★★★★★

- **tools**
[lodash](https://lodash.com/) | ★★★★★
[momentjs](http://momentjs.cn/) | ★★★
- **css**
[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference) | ★★★★★
[LESS](http://lesscss.org/) | ★★★★★
[PostCSS](https://postcss.org/) | ★★
[Animate.css](https://daneden.github.io/animate.css) | ★★★★
- **deploy**
[Webpack](https://webpack.github.io/) | ★★★
- **other**
[mock](http://mockjs.com/)  | ★★★★
- **extensive**
[mostly-adequate-guide](https://github.com/MostlyAdequate/mostly-adequate-guide) | ★★★★
[函数式编程](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/) | ★★★★