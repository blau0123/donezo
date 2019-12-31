import React from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import HomeNotesList from '../notes/HomeNotesList';
import HomeTodoList from '../todos/HomeTodoList';
import HomeEventsList from '../events/HomeEventsList';
import TeamHeader from './TeamHeader';

import './css/Team.css';

import {getTeamWithId, getAllTeams, completeTeamTodo, deleteTeamTodo} from '../../redux/actions/teamActions';

/*
Depends on the id of the team passed in, shows the team with that id
*/
class Team extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        // get the id of the team and call the action to get the specific team
        const {id} = this.props.match.params;
        // get the team that the user is viewing
        this.props.getTeamWithId(id);
        // get all teams to display in the dropdown
        this.props.getAllTeams();
    }

    componentDidUpdate(prevProps){
        // check if user selected new team in dropdown. if so, reload page to go to new team
        const newTeamId = this.props.location.state ? 
            this.props.location.state.teamId : '';
        const currTeamId = prevProps.team.currTeam._id ?
            prevProps.team.currTeam._id : '';

        // if the new team that the user wants to view is not the same team that's on screen, refresh
        if (newTeamId !== '' && currTeamId !== '' && newTeamId !== currTeamId){
            window.location.reload();
        }    

        // if added a note, then should refresh to show new note
        if (this.props.note.lastAddedNote !== prevProps.note.lastAddedNote){
            window.location.reload();
        }

        // if added a todo, should refresh to show new todo
        if (this.props.team.lastAddedTodo !== prevProps.team.lastAddedTodo){
            window.location.reload();
        }

        // if added an event, should refresh to show new event
        if (this.props.event.lastAddedEvent !== prevProps.event.lastAddedEvent){
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

    render(){
        // get the curr team from props that was obtained from store state after getTeamWithId called
        const {currTeam} = this.props.team;
        // get the curr user of the app
        const {user} = this.props.auth;

        // have all dropdown items be teams user is in
        const {teamsList} = this.props.team;
        const teamDropdownItems = teamsList && teamsList.length > 0 ?
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = this.isUserInTeam(team);
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                        <Dropdown.Item key={team._id}>
                            <Link to={{
                                pathname: `/team/${team._id}`, 
                                state: {teamId: team._id}
                            }}>{team.teamName}</Link>
                        </Dropdown.Item>
                    : null)
                
            }) : null;
        
        return(
            <div className="team-container">
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
                    <TeamHeader currTeam={currTeam} />

                    <div className="team-notes-list h-team-list">
                        <Link className='list-title' to={`/noteslist/${currTeam._id}`}>Notes</Link>
                        <div className='h-notes-list-container'>
                            <HomeNotesList currTeam={currTeam} />
                        </div>
                    </div>

                    <Grid container spacing={2}>
                        <Grid item sm={12} md={5} className='grid-todos'>
                            <div className="team-todos-list h-team-list">
                                <Grid container spacing={2}>
                                    <Grid item xs={9}>
                                        <h2 className='list-title h-todo-list'>Todos</h2>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Link to={{pathname: '/addtodo', state:{teamData: currTeam}}}>
                                            <AddIcon fontSize='large' className='add-icon todo-add' />
                                        </Link>
                                    </Grid>
                                </Grid>
                                <div className='h-todos-container'>
                                    <HomeTodoList currTeam={currTeam} history={this.props.history}/>
                                </div>
                            </div>
                        </Grid>
                        <Grid item sm={12} md={7}>
                            <div className="team-events-list">
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={9}>
                                            <h4>
                                                <Link className='list-title h-event-list' to={`/eventslist/${currTeam._id}`}>
                                                    Events
                                                </Link>
                                            </h4>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Link to={{pathname: '/addevent', state:{teamData: currTeam}}}>
                                                <AddIcon fontSize='large' className='add-icon event-add' />
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </div>
                                <HomeEventsList currTeam={currTeam} />
                            </div>
                        </Grid>
                    </Grid>
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