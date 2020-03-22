import {ADD_TAG} from '../actions/types';

const initState = {
    tags: [],
}

export default function(state = initState, action){
    switch(action.type){
        case ADD_TAG:
            state.tags.push(action.payload)
            return state;
        default:
            return state;
    }
}