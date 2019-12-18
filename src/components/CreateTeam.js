import React from 'react';
// axios used for making http requests to our api endpoints
import axios from 'axios';
import { connect } from 'react-redux';
import {createTeam} from '../redux/actions/teamActions';

class CreateTeam extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            teamName: "",
            teamDescription: "",
            teamMembers: [],
            teamNotes: [],
        }
        
        // binds the 'this' keyword inside of these functions to the entire class scope
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(evt){
        // changes either teamname or description based on which form was edited
        const changed = evt.target.name;
        this.setState({
            [changed]:evt.target.value
        });
    }

    onSubmit(evt){
        // prevent default html form submit behavior
        evt.preventDefault();

        // create the team object to send to database with the only member being the creator
        const currUser = {
            userId: this.props.auth.user.id,
            firstName: this.props.auth.user.firstName,
            lastName: this.props.auth.user.lastName,
        }
        const team = {
            teamName: this.state.teamName,
            teamDescription: this.state.teamDescription,
            teamMembers: [currUser],
            teamNotes: this.state.teamNotes,
        }

        // call the team action to create the team
        this.props.createTeam(team, this.props.history);
    }

    render(){
        return(
            <div className='container'>
                <h3>Create your own team.</h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-body'>
                        <label>What's your team's name?</label>
                        <input name='teamName' type='text' value={this.state.teamName} onChange={this.onChange} />
                        <label>How would you describe your team? Provide a description.</label>
                        <input name='teamDescription' type='text' value={this.state.teamDescription} onChange={this.onChange} />
                        <input type='submit' value='Create your team' />
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
});

export default connect(mapStateToProps, {createTeam})(CreateTeam);