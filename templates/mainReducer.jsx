/**
 * @file mainReducer.jsx
 * @desc main Reducer
 * @author jinbo
 * @data 
 */
import * as Redux from 'redux';
import commonReducer from './commonReducer.jsx';

let {combineReducers} = Redux;

const mainReducer = combineReducers({
        commonReducer,
        pageHomeReducer
    }
);

export default mainReducer;