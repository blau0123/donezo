import {ADD_EVENT_TO_TEAM, DELETE_EVENT, UPDATE_EVENT} from '../actions/types';

const initState = {
    lastAddedEvent: {},
}

export default function(state = initState, action){
    // find which action occurred to decide how to change the state
    switch(action.type){
        case ADD_EVENT_TO_TEAM:
            return {
                lastAddedEvent: action.payload,
            };
        case DELETE_EVENT:
            return {
                lastAddedEvent: action.payload,
            }
        case UPDATE_EVENT:
            return {
                lastAddedEvent: action.payload,
            }
        default:
            return state;
    }
}