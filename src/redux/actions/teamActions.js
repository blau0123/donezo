import axios from 'axios';

import {JOIN_TEAM, GET_TEAMS_WITH_PROMPT, GET_TEAM_WITH_ID, GET_ALL_TEAMS} from './types';

// action for a given user joining a given team
export const joinTeam = (userData, teamData) => dispatch => {
    const joinData = {userData, teamData}
    axios.post('http://localhost:5000/teams/join', joinData)
        .then(res => {
            alert(res.data);
            dispatch({
                type: JOIN_TEAM,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}

// action for creating a team by a user
/*
TODO: DISPATCH
*/
export const createTeam = (team, history) => dispatch => {
    // submit team into the database and go back to team page
    axios.post('http://localhost:5000/teams/add', team)
        .then(res => {
            console.log(res.data)
            history.push('/');
        })
        .catch(err => console.log(err));
}

// action to get all teams given a search prompt
export const searchTeamWithPrompt = (prompt) => dispatch => {
    // get all teams first
    axios.get('http://localhost:5000/teams/')
        .then(res => {
            let match = [];
            // go through all team names to check if matches the prompt
            for (let i = 0; i < res.data.length; i++){
                const teamName = res.data[i].teamName;
                const newTeamName = teamName.slice(0, prompt.length).toLowerCase();
                const newPrompt = prompt.toLowerCase();

                // if the team matches, then add it to the match array to be returned
                if (newTeamName === newPrompt){
                    match.push(res.data[i])
                }
            }
            console.log(match);
            // send match to reducer to update the state of TeamSearch component
            dispatch({
                type: GET_TEAMS_WITH_PROMPT,
                payload: match,
            })
        })
        .catch(err => console.log(err));
}

// get a team with the specific id
export const getTeamWithId = (id) => dispatch => {
    // make get request to get a specific team
    axios.get(`http://localhost:5000/teams/${id}`)
        .then(res => {
            // dispatch team to reducer to set the currteam state
            dispatch({
                type: GET_TEAM_WITH_ID,
                payload: res.data,
            })
        })
        .catch(err => console.log(err));
}

// get all teams
export const getAllTeams = () => dispatch => {
    axios.get('http://localhost:5000/teams/')
        .then(res => {
            const listOfAllTeams = res.data;
            dispatch({
                type: GET_ALL_TEAMS,
                payload: listOfAllTeams,
            })
        })
        .catch(err => console.log(err))
}

// add a note to the notes list for a given team
export const addNoteToTeam = (teamData, noteData) => dispatch => {
    axios.post('http://localhost:5000/teams/addnote', {teamData, noteData})
        .then(res => console.log(res))
        .catch(err => console.log(err))
}