import axios from 'axios';
import {ADD_NOTE_TO_TEAM, UPDATE_NOTE, DELETE_NOTE} from './types';

// add a note to the notes list for a given team
export const addNoteToTeam = (teamData, noteData, callback) => dispatch => {
    axios.post('/notes/add', {teamData, noteData})
        .then(res1 => {
            console.log(res1);
            // add note's objectid to team's notes
            const noteId = res1.data._id;
            axios.post('/teams/addnote', {teamData, noteId})
                .then(res2 => {
                    console.log(res2);
                    
                    // updates the state with the newest note added
                    dispatch({
                        type: ADD_NOTE_TO_TEAM,
                        payload: res1.data,
                    });

                    // call callback to refresh the page after done adding note
                    callback();
                })
                
        })
        .catch(err => console.log(err))
}

// updates a given note
export const updateNote = (noteData, callback) => dispatch => {
    axios.post('/notes/update', {noteData})
        .then(res => {
            console.log(res);

            // updates state with the newest note modified
            dispatch({
                type: UPDATE_NOTE,
                payload: res.data,
            });

            // call callback to refresh the page after done adding note
            callback();
        })
}

// delete a note
export const deleteNote = (noteData, teamData) => dispatch => {
    // remove objectid of note from team and then delete note document
    axios.post('/teams/deletenote', {noteData, teamData})
        .then(res => {
            // now delete the actual document
            axios.post('/notes/delete', {noteData})
                .then(res => {
                    console.log(res);
                    // updates state with null (newest note was deleted)
                    dispatch({
                        type: DELETE_NOTE,
                        payload: {deleted: true},
                    })
                })
                .catch(err => console.log('error!!', err))
        })
        .catch(err => console.log('error: ', err))
}