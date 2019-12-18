/*
The redux store that will hold the state of this application
*/

import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initState = {};

// list of middleware, only using thunk
const middlware = [thunk];

const store = createStore(
    rootReducer,
    initState,
    compose(applyMiddleware(... middlware))
);

export default store;