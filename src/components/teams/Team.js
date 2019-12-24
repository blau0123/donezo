import React from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';

import Card from '@material-ui/core/Card'

import {getTeamWithId, getAllTeams, completeTeamTodo, deleteTeamTodo} from '../../redux/actions/teamActions';

/*
Depends on the id of the team passed in, shows the team with that id
*/
class Team extends React.Component{
    constructor(props){
        super(props);

        this.onToggle = this.onToggle.bind(this);
        this.sortFutureEvents = this.sortFutureEvents.bind(this);
    }

    componentDidMount(){
        // get the id of the team and call the action to get the specific team
        const {id} = this.props.match.params;
        // get the team that the user is viewing
        this.props.getTeamWithId(id);
        // get all teams to display in the dropdown
        this.props.getAllTeams();
    }

    /*
    When using Link to change which team to view on Team.js component, send a new state that
    holds the id of the new team to view. we receive that new state here and we check if
    the new team id is the same as the current team id and if not, then the user wants to view
    a different team, so refresh
    */
    componentWillReceiveProps(nextProps){
        const newTeamId = nextProps.location.state ? 
            nextProps.location.state.teamId : '';
        const currTeamId = this.props.team.currTeam._id ?
            this.props.team.currTeam._id : '';

        // if the new team that the user wants to view is not the same team that's on screen, refresh
        if (newTeamId != '' && currTeamId != '' && newTeamId != currTeamId){
            window.location.reload();
        }    
    }

    componentDidUpdate(prevProps){
        // if added a note, then should refresh to show new note
        if (this.props.note.lastAddedNote != prevProps.note.lastAddedNote){
            window.location.reload();
        }

        // if added a todo, should refresh to show new todo
        if (this.props.team.lastAddedTodo != prevProps.team.lastAddedTodo){
            window.location.reload();
        }

        // if added an event, should refresh to show new event
        if (this.props.event.lastAddedEvent != prevProps.event.lastAddedEvent){
            window.location.reload();
        }
    }

    // checks if the user is in the teamMember list of this team
    isUserInTeam(team){
        // check if user is in the team
        const {user} = this.props.auth;
        const teamMembers = team.teamMembers;
        let isInTeam = false;
        for (let i = 0; i < teamMembers.length; i++){
            if (teamMembers[i].userId === user.id){
                isInTeam = true;
                break;
            }
        }
        return isInTeam;
    }

    onToggle(evt){
        console.log(evt.target.id, evt.target.value);
        const todoData = {
            id: evt.target.id,
        }
        const teamData = this.props.team.currTeam;

        // toggle the todo with this action dispatch
        this.props.completeTeamTodo(teamData, todoData);
    }

    sortFutureEvents(eventsList){
        eventsList.sort((a, b) => {
            a = new Date(a.eventStartTime);
            b = new Date(b.eventStartTime);
            return a < b ? -1 : a > b ? 1 : 0
        })
        return eventsList;
    }

    render(){
        // get the curr team from props that was obtained from store state after getTeamWithId called
        const {currTeam} = this.props.team;
        console.log(currTeam);
        // get the curr user of the app
        const {user} = this.props.auth;
        
        // get all of the pinned notes for this curr team and make a component
        const notesList = currTeam.teamNotes && currTeam.teamNotes.length > 0 ?
            currTeam.teamNotes.map(note => 
                note.pinned ? 
                    <Card>
                        <p>Pinned!</p>
                        <h6>{note.noteTitle}</h6>
                        <p>{note.noteBody}</p>
                        <p>By, {note.author}</p>
                    </Card>
                : null
            ) : <p>No notes yet!</p>;

        // get all of the todos for this curr team and make component
        const todosList = currTeam.teamTodos && currTeam.teamTodos.length > 0 ?
            currTeam.teamTodos.map(todo => 
                <Card>
                    <Link to={{pathname: '/edittodo', state:{teamData: currTeam, currTodo: todo}}}>
                        <p style={{fontWeight:'bold'}}>Assigned: 
                            {
                                todo.assignee && todo.assignee.length > 0 ? todo.assignee : 'None'
                            }
                        </p>
                        <Form>
                            <Form.Check 
                                custom
                                type='checkbox'
                                id={todo._id}
                                label={todo.todoText}
                                checked={todo.isCompleted}
                                onChange={this.onToggle}/>
                        </Form>
                        <button onClick={() => this.props.deleteTeamTodo(currTeam, todo)}>Delete</button>
                    </Link>
                </Card>
            ) : <p>No todos yet!</p>;

        // get all events for this curr team and make component
        let numPastEvents = 0;
        const sortedEvents = currTeam.teamEvents ? this.sortFutureEvents(currTeam.teamEvents)
                : currTeam.teamEvents;
        const eventsList = sortedEvents && sortedEvents.length > 0 ?
                sortedEvents.map(event => {
                    const start = new Date(event.eventStartTime);
                    const end = new Date(event.eventEndTime);
                    // don't show events that have already passed
                    const currTime = new Date();

                    if (currTime < start){
                        return(
                            <Card>
                                <h6>{event.eventTitle}</h6>
                                <p>{event.eventDescription}</p>
                                <p>Location: {event.eventLocation}</p>
                                <p>Start: {start.toLocaleString()}</p>
                                <p>End: {end.toLocaleString()}</p>
                            </Card>
                        )
                    }
                    else{ 
                        numPastEvents++;
                        return null;
                     }
                }) : <p>No events yet!</p>

        // have all dropdown items be teams user is in
        const {teamsList} = this.props.team;
        const teamDropdownItems = teamsList && teamsList.length > 0 ?
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = this.isUserInTeam(team);
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                        <Dropdown.Item>
                            <Link to={{
                                pathname: `/team/${team._id}`, 
                                state: {teamId: team._id}
                            }}>{team.teamName}</Link>
                        </Dropdown.Item>
                    : null)
                
            }) : null;
        
        return(
            <div className="container">
                <Link to='/'>Home</Link>
                <Dropdown>
                    <Dropdown.Toggle variant='success' id='team-selector'>
                        {
                            // decide if the user is on a team or if the user hasn't selected a team yet
                            this.props.team.teamsList.length > 0 ? this.props.team.currTeam.teamName : "Select Team"
                        }
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {teamDropdownItems}
                    </Dropdown.Menu>
                </Dropdown>

                <div className="teamNames" key={currTeam._id}>
                        <h2>{currTeam.teamName}</h2>
                        <h4>{currTeam.teamDescription}</h4>
                        <div className="container" style={{display:'flex'}}>
                            <p style={{fontWeight:'bold', flex:'0 20%'}}>Members:</p>
                            <div style={{flex:'1'}}>
                                {
                                    // if there are members for a given team, get the names of the members and display each name
                                    currTeam.teamMembers && currTeam.teamMembers.length > 0 ? 
                                        currTeam.teamMembers.map(member => 
                                            <p style={{display:'inline-block', marginRight:'10px'}}>
                                                {member.firstName + ' ' + member.lastName}
                                            </p>)
                                    : null
                                }
                            </div>
                        </div>
        
                        <div className="team-notes-list">
                            <h4>
                                <Link to={`/noteslist/${currTeam._id}`}>Notes</Link>
                            </h4>
                            {notesList}
                        </div>
                        <button><Link to={{pathname: '/addnote', state:{teamData: currTeam}}}>Add Note</Link></button>
                        
                        <div className="team-todos-list">
                            <h4>Todos</h4>
                            <div>
                                {todosList}
                            </div>
                        </div>
                        <button><Link to={{pathname: '/addtodo', state:{teamData: currTeam}}}>Add Todo</Link></button>
                        
                        <div className="team-events-list">
                            <h4>
                                <Link to={`/eventslist/${currTeam._id}`}>Events</Link>
                            </h4>
                            {eventsList}
                            <p>You have {numPastEvents} past event(s).</p>
                        </div>
                        <button><Link to={{pathname: '/addevent', state:{teamData: currTeam}}}>Add Event</Link></button>
                    </div>
            </div>
        )
        
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
    note: state.note,
    event: state.event,
});

export default connect(mapStateToProps, {getTeamWithId, getAllTeams, completeTeamTodo,
        deleteTeamTodo})(Team);