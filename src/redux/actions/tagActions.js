import axios from 'axios';
import {ADD_TAG} from './types';

// add a note to the notes list for a given team
export const addTag = (tagData) => dispatch => {
    axios.post('http://localhost:5000/tags/add', {tagData})
        .then(res => {
            console.log(res);
            // need to add tag to the current team too
            dispatch({
                type: ADD_TAG,
                payload: tagData,
            })
        })
        .catch(err => console.log(err))
}