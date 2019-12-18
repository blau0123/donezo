/*
Changes the state variables that deal with error handling depending on
which type of action was dispatched
*/

import {GET_ERRORS} from '../actions/types';

const initState = {};

export default (state = initState, action) => {
    switch(action.type){
        case GET_ERRORS:
            return action.payload;
        default:
            return state;
    }
}