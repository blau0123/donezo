import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {logoutUser} from '../../redux/actions/authActions';
import {connect} from 'react-redux';
import {joinTeam} from '../../redux/actions/teamActions';
import SettingsModal from '../modals/SettingsModal';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import './css/Home.css';

class Home extends React.Component{
    constructor(){
        super();
        // currteam holds the id of the team the user is currently viewing
        this.state = {
            teams: [],
            currTeam: '',
            settings: ['Log out'],
            showModal: false,
        }

        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    
    componentDidMount(){
        // show the list of teams in the database
        const userId = this.props.auth.user.id;
        axios.get('http://localhost:5000/teams/', userId)
            .then(res => this.setState({teams: res.data}));
    }

    // checks if the user is in the teamMember list of this team
    isUserInTeam(team){
        // check if user is in the team
        const {user} = this.props.auth;
        const teamMembers = team.teamMembers;
        let isInTeam = false;
        for (let i = 0; i < teamMembers.length; i++){
            if (teamMembers[i].user._id === user.id){
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

    showModal = () => {this.setState({showModal: true})}

    hideModal = () => {this.setState({showModal: false})}

    render(){
        // get the curr user of the app
        const {user} = this.props.auth;
    
        // have all dropdown items be teams user is in
        const teamsList = this.state.teams;
        
        const usersTeams = teamsList && teamsList.length > 0 ?
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = this.isUserInTeam(team);
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                    <Link className='team-item-link' to={{
                        pathname: `/team/${team._id}`, 
                        state:{teamId: team._id}
                    }}>
                        <Card className='team-item'>
                            <li className='color-blue'>
                                {team.teamName}
                            </li>
                        </Card>
                    </Link>
                    : null)
                
            }) : null;

        return(
            <div className='home-container'>
                <Card className='home-card-container'>         
                    <div className='logout-container'>
                        <MoreVertIcon fontSize='large' onClick={this.showModal}
                            className='settings-icon'/>
                        <SettingsModal showModal={this.state.showModal} handleClose={this.hideModal}
                                children={this.state.settings} handleLogout={this.onLogoutClick} />
                    </div>
                
                    <h2 className="welcome-text">Welcome, {user.firstName}</h2>        
                    <h5>Choose your team.</h5>
                    <ul className='list-of-user-teams'>
                        {usersTeams}
                    </ul>
                    <Link className='home-btn' to='/teamsearch'>Search for a new team!</Link>
                    <Link className='home-btn create-team' to='/createTeam'>Create a new team here</Link>
                </Card>
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