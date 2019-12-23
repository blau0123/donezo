import axios from 'axios';
import {ADD_NOTE_TO_TEAM} from './types';

// add a note to the notes list for a given team
export const addNoteToTeam = (teamData, noteData) => dispatch => {
    axios.post('http://localhost:5000/notes/add', {teamData, noteData})
        .then(res => {
            console.log(res);
            // add note's objectid to team's notes
            const noteId = res.data._id;
            axios.post('http://localhost:5000/teams/addnote', {teamData, noteId})
                .then(res => {
                    console.log(res);
                    /*
                    dispatch({
                        type: ADD_NOTE_TO_TEAM,
                        payload: res.data,
                    })
                    */
                })
                
        })
        .catch(err => console.log(err))
}