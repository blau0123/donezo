import axios from 'axios';
import {ADD_EVENT_TO_TEAM} from './types';

// add a note to the notes list for a given team
export const addEventToTeam = (teamData, eventData) => dispatch => {
    axios.post('http://localhost:5000/events/add', {teamData, eventData})
        .then(res1 => {
            console.log(res1);
            // add note's objectid to team's notes
            const eventId = res1.data._id;

            axios.post('http://localhost:5000/teams/addevent', {teamData, eventId})
                .then(res2 => {
                    console.log(res2);
                    
                    // updates the state with the newest note added
                    dispatch({
                        type: ADD_EVENT_TO_TEAM,
                        payload: res1.data,
                    })
                })
                
        })
        .catch(err => console.log(err))
}
