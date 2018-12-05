/**
 * @file rootReducer.jsx
 * @desc root Reducer
 * @author jinbo
 * @data 
 */
import { combineReducers } from 'redux';
import commonReducer from './commonReducer.jsx';

const rootReducer = combineReducers({
    commonReducer
});

export default rootReducer;