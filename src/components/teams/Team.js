import React from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';

import {getTeamWithId, getAllTeams} from '../../redux/actions/teamActions';

/*
Depends on the id of the team passed in, shows the team with that id
*/
class Team extends React.Component{
    constructor(props){
        super(props);

        this.onToggle = this.onToggle.bind(this);
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
        if (this.props.team.lastAddedNote != prevProps.team.lastAddedNote){
            window.location.reload();
        }

        // if added a todo, should refresh to show new todo
        if (this.props.team.lastAddedTodo != prevProps.team.lastAddedTodo){
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
    }

    render(){
        // get the curr team from props that was obtained from store state after getTeamWithId called
        const {currTeam} = this.props.team;
        // get the curr user of the app
        const {user} = this.props.auth;
        
        // get all of the notes for this curr team and make a component
        const notesList = currTeam.teamNotes && currTeam.teamNotes.length > 0 ?
            currTeam.teamNotes.map(note => 
                <div style={{borderStyle: 'solid'}}>
                    <h6>{note.noteTitle}</h6>
                    <p>{note.noteBody}</p>
                    <p>By, {note.author}</p>
                </div>
            ) : null;

        // get all of the todos for this curr team and make component
        const todosList = currTeam.teamTodos && currTeam.teamTodos.length > 0 ?
            currTeam.teamTodos.map(todo => 
                <div>
                   <Form>
                       <Form.Check 
                            custom
                            type='checkbox'
                            id={todo._id}
                            label={todo.todoText}
                            onChange={this.onToggle}/>
                   </Form>
                </div>
            ) : null;

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
                        {
                            // if there are members for a given team, get the names of the members and display each name
                            currTeam.teamMembers && currTeam.teamMembers.length > 0 ? 
                                currTeam.teamMembers.map(member => 
                                    <p>{member.firstName + ' ' + member.lastName}</p>)
                            : null
                        }
                        <div className="team-notes-list">
                            <h4>Notes</h4>
                            {notesList}
                        </div>
                        <button><Link to={{pathname: '/addnote', state:{teamData: currTeam}}}>Add Note</Link></button>
                        
                        <div className="team-todos-list">
                            <h4>Todos</h4>
                            <div className="list" style={{borderStyle:'solid'}}>
                                {todosList}
                            </div>
                        </div>
                        <button><Link to={{pathname: '/addtodo', state:{teamData: currTeam}}}>Add Todo</Link></button>
                    </div>
            </div>
        )
        
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
});

export default connect(mapStateToProps, {getTeamWithId, getAllTeams})(Team);