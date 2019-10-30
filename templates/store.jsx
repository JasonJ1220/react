/**
 * @file store.js
 * @author jinbo
 * @date
 */

import mainReducer from './mainReducer.jsx';
import * as Redux from 'redux';
import thunk from 'redux-thunk';

let {createStore, applyMiddleware, compose} = Redux;


const enhancer = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    // devTools({
    //     name: 'blackhole',
    //     realtime: true
    // })
);

const store = createStore(mainReducer, enhancer);
export default store;