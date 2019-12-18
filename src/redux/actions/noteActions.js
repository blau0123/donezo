import axios from 'axios';
import {ADD_NOTE, GET_NOTES_FOR_TEAM} from './types'

// action to add a note to the db
export const addNote = (teamData, noteData) => dispatch => {
    // add the note to the notes database
    axios.post('http://localhost:5000/notes/add', noteData)
        .then(res => {
            console.log('note added');
            const noteId = res.data._id;
            // send the new note id to the team api endpoint to add it to the teams note list in db
            axios.post('http://localhost:5000/teams/addnote', {teamData, noteId})
                .then(res => {
                    console.log(res);
                    // dispatch to notes reducer after complete add to both notes db and teams
                    dispatch({
                        type: ADD_NOTE,
                        payload: noteId,
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

// action to get list of notes from list of noteids
export const getNotesForTeam = (noteIdsList) => dispatch => {
    let promises = [];
    let teamNotes = [];
    // go through each note id and get a promise for getting the note
    noteIdsList.forEach(noteId => {
        promises.push(axios.get(`http://localhost:5000/notes/${noteId}`));
    })
    // resolve every promise and add each result to the teamNotes
    axios.all(promises).then((results) => {
        results.forEach(resp => {
            console.log(resp);
            teamNotes.push(resp.data)
        })
    })
    console.log(teamNotes);
    // dispatch action to reducer to update team notes array
    dispatch({
        type: GET_NOTES_FOR_TEAM,
        payload: teamNotes,
    })
}