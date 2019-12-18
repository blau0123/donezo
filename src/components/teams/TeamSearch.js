import React from 'react';
import { connect } from 'react-redux';
import {joinTeam, searchTeamWithPrompt} from '../../redux/actions/teamActions';
import { Link } from 'react-router-dom';

class TeamSearch extends React.Component{
    constructor(){
        super();

        this.state = {
            prompt: '',
        }

        this.searchForTeamWithPrompt = this.searchForTeamWithPrompt.bind(this);
        this.joinTeam = this.joinTeam.bind(this);
        this.onChange = this.onChange.bind(this);
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

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    searchForTeamWithPrompt(evt){
        evt.preventDefault();
        // call the team action to search for a team
        const searchPrompt = this.state.prompt;
        this.props.searchTeamWithPrompt(searchPrompt);
    }

    render(){
        // can use searchTeamWithPrompt using this.props bc of redux
        const {matchedTeams} = this.props.teams;

        // create a list component that displays all of the teams that matched the prompt
        const matchedTeamsList = matchedTeams.length > 0 ? 
                matchedTeams.map(matchedTeam => 
                    <div className="teamNames" key={matchedTeam._id}>
                        <h1>{matchedTeam.teamName}</h1>
                        <h3>{matchedTeam.teamDescription}</h3>
                        {
                            // if there are members for a given team, get the names of the members and display each name
                            matchedTeam.teamMembers.length > 0 ? 
                                matchedTeam.teamMembers.map(member => 
                                    <p>{member.firstName + ' ' + member.lastName}</p>)
                            : null
                        }
                        <button id={matchedTeam._id} onClick={this.joinTeam}>Join {matchedTeam.teamName}</button>
                    </div>
                )
            : null;

        return(
            <div className='search-container'>
                <Link to='/'>Home</Link>
                <div className='search-bar'>
                    <form onSubmit={this.searchForTeamWithPrompt}>
                        <label>Type in a team name.</label>
                        <input type='text' name='prompt' value={this.state.prompt} onChange={this.onChange} />

                        <input type='submit' value='Search' />
                    </form>
                </div>
                {matchedTeamsList}
            </div>

        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    teams: state.team,
});

export default connect(mapStateToProps, {joinTeam, searchTeamWithPrompt})(TeamSearch);