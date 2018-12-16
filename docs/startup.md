# 从零开始

1. 准备
2. 目录结构说明
3. 参考资料


## 准备

### 开发环境
基础环境必须依赖nodejs和npm,未安装的可以去官网自行安装，安装教程这里不详细说明，安装完成后使用如下命令，查看是否安装成功。
```
node -v
npm -v
```

### 技能
- HTML+CSS+JavaScript
- ES6+
- React\UmiJS\dva\g2\antd\mock
- webpack\babel
- git\nodejs\npm\yarn

### 重要概念
#### pure function
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
#### effect


## 参考资料
- **basic**
[ES6](http://es6.ruanyifeng.com/)
[React](https://reactjs.org/)
[Redux](https://redux.js.org/)
[immutable](http://facebook.github.io/immutable-js/)
[redux-saga](https://redux-saga-in-chinese.js.org/)
- **tools**
[lodash](https://lodash.com/)
[momentjs](http://momentjs.cn/)
- **css**
[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
[LESS](http://lesscss.org/)
[PostCSS](https://postcss.org/)
[Animate.css](https://daneden.github.io/animate.css/?)
- **deploy**
[Webpack](https://webpack.github.io/)
- **other**
[mock](http://mockjs.com/)