import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {joinTeam} from '../../redux/actions/teamActions';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

class TeamsList extends React.Component{
    constructor(){
        super();
        this.isUserInTeam = this.isUserInTeam.bind(this);
        this.joinTeam = this.joinTeam.bind(this);
    }

    // when user clicks join team button, calls the redux action to let the user join
    joinTeam(evt){
        evt.preventDefault();
        // collect the data required to join the team members list
        const userId = this.props.auth.user.id;
        const userFirst = this.props.auth.user.firstName;
        const userLast = this.props.auth.user.lastName;
        const userData = {
            id: userId,
            firstName: userFirst,
            lastName: userLast,
        };
        const teamData = evt.target.id;
        // call the team action that joins a given user to a given team
        this.props.joinTeam(userData, teamData);
    }

    // checks if the user is in the teamMember list of this team
    isUserInTeam(team){
        // check if user is in the team
        const {user} = this.props;
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
        // this.props will hold teams passed from Home
        const teamsList = this.props.teams;
        // if there are teams, then display each team and some of their fields
        const teams = teamsList.length > 0 ? 
            teamsList.map(team => {
                // need to check if the user is in a certain team or not
                const userIsInTeam = this.isUserInTeam(team);
                
                // if the user is in the team, show it and if not don't show the team
                return (userIsInTeam ? 
                        <div className="teamNames" key={team._id}>
                            <h1>{team.teamName}</h1>
                            <h3>{team.teamDescription}</h3>
                            {
                                // if there are members for a given team, get the names of the members and display each name
                                team.teamMembers.length > 0 ? 
                                    team.teamMembers.map(member => 
                                        <p>{member.firstName + ' ' + member.lastName}</p>)
                                : null
                            }
                            <button id={team._id} onClick={this.joinTeam}>Join {team.teamName}</button>
                        </div>
                    : null)
                
            }) : null;
            
        return(
            <div>
                {teams}
                <Link to='/createTeam'>Create a new team.</Link>
            </div>
        )
        
    }
}

// puts the state from the store into the props of this component
const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
})

export default connect(mapStateToProps, {joinTeam})(TeamsList);