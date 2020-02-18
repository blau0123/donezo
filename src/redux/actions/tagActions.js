import axios from 'axios';
import {ADD_TAG} from './types';

// add a note to the notes list for a given team
export const addTag = (teamId, tagData) => dispatch => {
    console.log(tagData);
    axios.post('http://localhost:5000/tags/add', {tagData})
        .then(res1 => {
            console.log(res1);
            // res1.data holds the entire new tag object (_id, title, description)
            const tagId = res1.data._id;
            // need to add tag to the current team too
            axios.post(`http://localhost:5000/teams/${teamId}/tags/add`, {tagId})
                .then(res2 => {
                    console.log(res2);
                    dispatch({
                        type: ADD_TAG,
                        payload: tagData,
                    })
                })
        })
        .catch(err => console.log(err))
}