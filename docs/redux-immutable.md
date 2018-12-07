# redux-immutable
> https://github.com/gajus/redux-immutable#readme

创建一个用于替换 redux 中 combineReducers 的方法。
且当 Redux createStore 的 reducer 是被 redux-immutable 创建的话，那么 initialState 创建的state必须是 Immutable.Collection 的实例。

用法：
```
// combineReducers方法从 redux-immutable 引用
import {
  combineReducers
} from 'redux-immutable';
 
import {
  createStore
} from 'redux';
 
const initialState = Immutable.Map();
const rootReducer = combineReducers({});
const store = createStore(rootReducer, initialState);
```
