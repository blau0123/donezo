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
import tagReducer from './tagReducers';

/*
Creates root reducer with all of the reducers inside
Can access the state inside of a reducer in the frontend
by using mapStateToProps and doing tags: state.tags
*/
export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    team: teamReducer,
    note: noteReducer,
    event: eventReducer,
    tags: tagReducer,
});