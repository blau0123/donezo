import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import HomeNotesList from '../notes/HomeNotesList';
import HomeTodoList from '../todos/HomeTodoList';
import HomeEventsList from '../events/HomeEventsList';
import TeamHeader from './TeamHeader';
import SearchResults from "./SearchResults";

import './css/Team.css';

import {getTeamWithId, getAllTeams, completeTeamTodo, deleteTeamTodo} from '../../redux/actions/teamActions';

/*
Depends on the id of the team passed in, shows the team with that id
*/
class Team extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            search:""
        }
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

    onChange = evt => {
        this.setState({search: evt.target.value})
    }

    render(){
        // get the curr team from props that was obtained from store state after getTeamWithId called
        const {currTeam} = this.props.team;
        // get the curr user of the app
        const {user} = this.props.auth;        

        // the search bar
        const search = 
        <div>
            <input className="search" onChange={this.onChange} value={this.state.search} placeholder="Search for something..."></input>
        </div>

        return(
            <div className="team-container">
                <div className="teamNames" key={currTeam._id}>
                    <TeamHeader currTeam={currTeam} currUser={user}/>

                    {search}

                    {
                        // if the user is searching for something, show the search results. if not, show regular view
                        this.state.search && this.state.search.trim().length > 0 ? <SearchResults search={this.state.search} currTeam={currTeam}/> :
                            <React.Fragment>
                                <div className="team-notes-list h-team-list">
                                    <Link className='list-title' to={`/noteslist/${currTeam._id}`}>Notes</Link>
                                    <Link to={`/team/${currTeam._id}/notes`}>Test</Link>
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
                            </React.Fragment>
                    }
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