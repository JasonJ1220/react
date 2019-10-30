# redux-saga
> https://redux-saga-in-chinese.js.org/

一个用于管理应用程序 Side Effect（副作用，例如异步获取数据，访问浏览器缓存等）的 library，它的目标是让副作用管理更容易，执行更高效，测试更简单，在处理故障时更容易。

## 开始
### 安装
```
npm install --save redux-saga

rem or

yarn add redux-saga
```
## 使用
1. 使用createSagaMiddleware方法创建saga 的Middleware，然后在创建的redux的store时，使用applyMiddleware函数将创建的saga Middleware实例绑定到store上，最后可以调用saga Middleware的run函数来执行某个或者某些Middleware。
1. 在saga的Middleware中，可以使用takeEvery或者takeLatest等API来监听某个action，当某个action触发后，saga可以使用call、fetch等api发起异步操作，操作完成后使用put函数触发action，同步更新state，从而完成整个State的更新。

```
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
//测试saga
import { helloSaga } from './sagas'
//创建saga中间件
const sagaMiddleware=createSagaMiddleware();
//使用中间件
const store = createStore(
 reducer,
 applyMiddleware(sagaMiddleware)
);
//运行saga
sagaMiddleware.run(helloSaga);
```


## API
### Effect 创建器
#### take(pattern)
创建一个 Effect 描述信息，用来命令 middleware 在 Store 上等待指定的 action。 在发起与 pattern 匹配的 action 之前，Generator 将暂停。
我们用以下规则来解释 pattern：
- 如果以空参数或 '*' 调用 take，那么将匹配所有发起的 action。（例如，take() 将匹配所有 action）
- 如果它是一个函数，那么将匹配 pattern(action) 为 true 的 action。（例如，take(action => action.entities) 将匹配哪些 entities 字段为真的 action）
- 注意: 如果 pattern 函数上定义了 toString，action.type 将改用 pattern.toString 来测试。这个设定在你使用 action 创建函数库（如 redux-act 或 redux-actions）时非常有用。
- 如果它是一个字符串，那么将匹配 action.type === pattern 的 action。（例如，take(INCREMENT_ASYNC)）
- 如果它是一个数组，那么数组中的每一项都适用于上述规则 —— 因此它是支持字符串与函数混用的。不过，最常见的用例还属纯字符串数组，其结果是用 action.type 与数组中的每一项相对比。（例如，take([INCREMENT, DECREMENT]) 将匹配 INCREMENT 或 DECREMENT 类型的 action）

middleware 提供了一个特殊的 action —— END。如果你发起 END action，则无论哪种 pattern，只要是被 take Effect 阻塞的 Sage 都会被终止。假如被终止的 Saga 下仍有分叉（forked）任务还在运行，那么它在终止任务前，会先等待其所有子任务均被终止。

#### put(action)
创建一个 Effect 描述信息，用来命令 middleware 向 Store 发起一个 action。 这个 effect 是非阻塞型的，并且所有向下游抛出的错误（例如在 reducer 中），都不会冒泡回到 saga 当中。

#### call(fn, ...args)
创建一个 Effect 描述信息，用来命令 middleware 以参数 args 调用函数 fn 。用于执行异步函数。

#### fork(fn, ...args)
创建一个 Effect 描述信息，用来命令 middleware 以 非阻塞调用 的形式执行 fn。返回一个 Task 对象。

fork 类似于 call，可以用来调用普通函数和 Generator 函数。不过，fork 的调用是非阻塞的，Generator 不会在等待 fn 返回结果的时候被 middleware 暂停；恰恰相反地，它在 fn 被调用时便会立即恢复执行。

所有分叉任务（forked tasks）都会被附加（attach）到它们的父级任务身上。当父级任务终止其自身命令的执行，它会在返回之前等待所有分叉任务终止。

#### spawn(fn, ...args)
与 fork(fn, ...args) 相同，但创建的是 被分离的 任务。被分离的任务与其父级任务保持独立，并像顶级任务般工作。父级任务不会在返回之前等待被分离的任务终止，并且所有可能影响父级或被分离的任务的事件都是完全独立的（错误、取消）。




### 辅助函数
#### takeEvery
takeEvery 允许多个 fetchData 实例同时启动。在某个特定时刻，尽管之前还有一个或多个 fetchData 尚未结束，我们还是可以启动一个新的 fetchData 任务。

创建一个将执行异步 action 的任务
```
import { call, put } from 'redux-saga/effects'

export function* fetchData(action) {
   try {
      const data = yield call(Api.fetchUser, action.payload.url);
      yield put({type: "FETCH_SUCCEEDED", data});
   } catch (error) {
      yield put({type: "FETCH_FAILED", error});
   }
}
```
然后在每次 FETCH_REQUESTED action 被发起时启动上面的任务。
```
import { takeEvery } from 'redux-saga'

function* watchFetchData() {
  yield* takeEvery('FETCH_REQUESTED', fetchData)
}
```

#### takeLatest

如果我们只想得到最新那个请求的响应（例如，始终显示最新版本的数据）。我们可以使用 takeLatest 辅助函数。

和 takeEvery 不同，在任何时刻 takeLatest 只允许一个 fetchData 任务在执行。并且这个任务是最后被启动的那个。 如果已经有一个任务在执行的时候启动另一个 fetchData ，那之前的这个任务会被自动取消。
```
import { takeLatest } from 'redux-saga'

function* watchFetchData() {
  yield* takeLatest('FETCH_REQUESTED', fetchData)
}
```