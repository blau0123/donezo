import {ADD_EVENT_TO_TEAM} from '../actions/types';

const initState = {
    lastAddedEvent: [],
}

export default function(state = initState, action){
    // find which action occurred to decide how to change the state
    switch(action.type){
        case ADD_EVENT_TO_TEAM:
            return {
                lastAddedEvent: action.payload,
            };
        default:
            return state;
    }
}