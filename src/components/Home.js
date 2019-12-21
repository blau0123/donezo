import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {logoutUser} from '../redux/actions/authActions';
import {connect} from 'react-redux';
import {joinTeam} from '../redux/actions/teamActions';

import Dropdown from 'react-bootstrap/Dropdown';

import TeamsList from './teams/TeamsList';

class Home extends React.Component{
    constructor(){
        super();
        // currteam holds the id of the team the user is currently viewing
        this.state = {
            teams: [],
            currTeam: ''
        }

        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
    }
    
    componentDidMount(){
        // show the list of teams in the database
        axios.get('http://localhost:5000/teams/')
            .then(res => this.setState({teams: res.data}));
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

    // calls auth action to log user out and then refresh the page
    onLogoutClick(evt){
        evt.preventDefault();
        this.props.logoutUser();
        // since the user is now logged out, reload the page to take them to login
        window.location.reload();
    }

    render(){
        // get the curr user of the app
        const {user} = this.props.auth;
    
        // have all dropdown items be teams user is in
        const teamsList = this.state.teams;
        const teamDropdownItems = teamsList && teamsList.length > 0 ?
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = this.isUserInTeam(team);
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                        <Dropdown.Item>
                            <Link to={`/team/${team._id}`}>{team.teamName}</Link>
                        </Dropdown.Item>
                    : null)
                
            }) : null;
        
        const usersTeams = teamsList && teamsList.length > 0 ?
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = this.isUserInTeam(team);
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                    <li className='team-item'>
                        <Link to={{
                            pathname: `/team/${team._id}`, 
                            state:{teamId: team._id}
                        }}>{team.teamName}</Link>
                    </li>
                    : null)
                
            }) : null;

        return(
            <div>
                <button onClick={this.onLogoutClick}>Log out</button>
                <Link to='/teamsearch'>Search for a new team!</Link>
                <div className="welcome-text">
                    <h2>Welcome, {user.firstName}</h2>        
                </div>
                <h5>Choose your team.</h5>
                <ul className='list-of-user-teams'>
                    {usersTeams}
                </ul>
                <Link to='/createTeam'>Create a new team here</Link>
            </div>
        )
    }
}

//<TeamsList teams={this.state.teams} user={user} />

// puts the state from the store into the props of this component
const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
})

export default connect(mapStateToProps, {logoutUser, joinTeam})(Home);