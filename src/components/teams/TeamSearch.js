import React from 'react';
import { connect } from 'react-redux';
import {joinTeam, searchTeamWithPrompt} from '../../redux/actions/teamActions';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';

import './css/TeamSearch.css';

class TeamSearch extends React.Component{
    constructor(){
        super();

        // hasSearched is used to show the user if no teams match their prompt after they search
        // (rather than showing it before they even search)
        this.state = {
            prompt: '',
            hasSearched: false,
        }

        this.searchForTeamWithPrompt = this.searchForTeamWithPrompt.bind(this);
        this.joinTeam = this.joinTeam.bind(this);
        this.onChange = this.onChange.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
    }

    componentDidMount(){
        // reset prompt
        this.setState({prompt: ''})
    }

    // when user clicks join team button, calls the redux action to let the user join
    joinTeam(evt){
        evt.preventDefault();
        /* collect the data required to join the team members list
        const userId = this.props.auth.user.id;
        const userFirst = this.props.auth.user.firstName;
        const userLast = this.props.auth.user.lastName;
        const userData = {
            id: userId,
            firstName: userFirst,
            lastName: userLast,
        };
        */
        const userId = this.props.auth.user.id;
        const userData = {
            user: userId,
            isAdmin: false,
        }

        const teamData = evt.target.id;
        // call the team action that joins a given user to a given team
        this.props.joinTeam(userData, teamData);
    }

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    searchForTeamWithPrompt(evt){
        evt.preventDefault();
        // call the team action to search for a team
        const searchPrompt = this.state.prompt;
        this.setState({hasSearched: true})
        this.props.searchTeamWithPrompt(searchPrompt);
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

    render(){
        // can use searchTeamWithPrompt using this.props bc of redux
        const {matchedTeams} = this.props.teams;

        // create a list component that displays all of the teams that matched the prompt
        const matchedTeamsList = matchedTeams.length > 0 ? 
                matchedTeams.map(matchedTeam => 
                    <div className="teamNames" key={matchedTeam._id}>
                        <Card className='searched-card'>
                            <h1 className='team-name'>{matchedTeam.teamName}</h1>
                            <h3>{matchedTeam.teamDescription.slice(0, 100)}</h3>
                            {
                                // only show join btn if user is not apart of team
                                matchedTeam.teamMembers && matchedTeam.teamMembers.length > 0 
                                    && this.isUserInTeam(matchedTeam) ?
                                   <p className='join-btn'>You are already in this team.</p> :
                                   <button id={matchedTeam._id} onClick={this.joinTeam} 
                                        className='join-btn btn'>
                                        Join {matchedTeam.teamName}
                                    </button>
                            }
                        </Card>
                    </div>
                )
            : null;

        return(
            <div className='search-container'>
                <Link to='/'>Home</Link>
                <div className='search-bar'>
                    <form onSubmit={this.searchForTeamWithPrompt} className='search-bar'>
                        <h1 className='search-prompt'>Type in a team name.</h1>
                        <input type='text' name='prompt' value={this.state.prompt} onChange={this.onChange}
                            className='search-input' />

                        <input className='submit-btn btn' type='submit' value='Search' />
                    </form>
                    <div className='matched-teams'>
                        {
                            matchedTeams.length > 0 ? 
                                matchedTeamsList : 
                                this.state.hasSearched ? 
                                    <p className='no-match'>No teams matched your search 😢</p> : null
                        }
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    teams: state.team,
});

export default connect(mapStateToProps, {joinTeam, searchTeamWithPrompt})(TeamSearch);