/*
Changes the state variables that deal with authentication depending on
which type of action was dispatched
*/

import {SET_CURRENT_USER, USER_LOADING} from '../actions/types';

const initState = {
    isAuthenticated: false,
    user: {},
    loading: false,
}

export default function(state = initState, action){
    // find which action occurred to decide how to change the state
    switch(action.type){
        case SET_CURRENT_USER:
            return{
                ...state,
                isAuthenticated: action.payload,
                user: action.payload,
            }
        case USER_LOADING:
            return{
                ...state,
                loading: true,
            }
        default:
            return state;
    }
}