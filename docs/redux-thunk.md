# redux-thunk

redux-thunk是用来做异步的
他允许你的action可以返回函数, 带有dispatch和getState两个参数, 在这个action函数里, 异步的dispatch action;

## redux-thunk 源码
```
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

三个核心问题：
1. dispatch, getState 哪儿来的？ 
2. next干什么的？

![](https://i.imgur.com/VMcQQCj.png)

3. 为什么会有这种操作：action(dispatch, getState, extraArgument); 

首先，涉及到应用到thunk的action creator的合法写法：
```
let thunkActionCreator = () => (param1, param2) => {
    ....
    param1({actionType: value});
    .....
}
//注意：此时的dispatch其实已经包裹了引入的middleware的逻辑
//dispatch= fn1Middle(fn2Middle(store.dispatch))

storeWithMiddleware.dispatch(
  thunkActionCreator()
);
```
从thunk的源码中可以看到，dispatch和getState方法分别赋给了param1 和param2(函数作用域链)。