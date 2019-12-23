/*
Will be the root reducer that combines authReducer, errorReducer
because a store can only be initialized with a single reducer
*/

import {combineReducers} from 'redux';
import authReducer from './authReducers';
import errorReducer from './errorReducers';
import teamReducer from './teamReducer';
import noteReducer from './noteReducer';
import eventReducer from './eventReducer';

// authReducer will be referred to as auth by the root reducer & same for error
export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    team: teamReducer,
    note: noteReducer,
    event: eventReducer,
});