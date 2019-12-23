import {ADD_NOTE_TO_TEAM} from '../actions/types';

const initState = {
    lastAddedNote: [],
}

export default function(state = initState, action){
    // find which action occurred to decide how to change the state
    switch(action.type){
        case ADD_NOTE_TO_TEAM:
            return {
                lastAddedNote: action.payload,
            };
        default:
            return state;
    }
}