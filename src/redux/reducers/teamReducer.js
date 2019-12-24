import { JOIN_TEAM, GET_TEAMS_WITH_PROMPT, GET_TEAM_WITH_ID, GET_ALL_TEAMS, ADD_NOTE_TO_TEAM, 
            ADD_TODO_TO_TEAM, COMPLETE_TODO, ADD_EVENT_TO_TEAM, DELETE_TODO, EDIT_TODO} from "../actions/types";

/*
Changes the state variables that deal with teams depending on which 
action is dispatched, including joining teams
*/

/*
teams: list of all teams, 
matchedTeams: list of teams for TeamSearch.js
team: specific team for Team.js
*/
const initState = {
    teamsList: [],
    matchedTeams: [],
    currTeam: {},
    lastAddedTodo: {},
}
export default function(state = initState, action){
    // find which action occurred to decide how to change the state
    switch(action.type){
        case JOIN_TEAM:
            // after action, teams have been updated with new members, so update teams var
            return state;
        case GET_TEAMS_WITH_PROMPT:
            // return the updated state, with the newly matched teams to the user's prompt
            return {
                ...state,
                matchedTeams: action.payload,
            }
        case GET_TEAM_WITH_ID:
            // set the state currTeam to the team that the user is viewing
            return {
                ...state,
                currTeam: action.payload,
            };
        case GET_ALL_TEAMS:
            // set state of teams with list of all teams
            return {
                ...state,
                teamsList: action.payload,
            }
        case ADD_TODO_TO_TEAM:
            // set the state of last added todo (for page refresh)
            return {
                ...state,
                lastAddedTodo: action.payload,
            }
        case COMPLETE_TODO:
            // update state with the newly completed todo
            return {
                ...state,
                lastAddedTodo: action.payload,
            }
        case DELETE_TODO:
            return {
                ...state,
                lastAddedTodo: action.payload,
            }
        case EDIT_TODO:
            return {
                ...state,
                lastAddedTodo: action.payload,
            }
        default:
            return state;
    }
}