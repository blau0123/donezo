import React from 'react';
import { connect } from 'react-redux';
import {createTeam} from '../../redux/actions/teamActions';

import './css/CreateTeam.css';

class CreateTeam extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            teamName: "",
            teamDescription: "",
            teamMembers: [],
            teamNotes: [],
            // will hold index of possibErrors if that error exists
            currErrors: -1,
        }

        this.possibErrors = ['You need to enter a name and description']
        
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

        // reset any errors that may have occurred
        this.setState({currErrors: -1})

        // if any of the state is empty, alert the user and don't move on
        if (this.state.teamName.trim() === '' || this.state.teamDescription.trim() === ''){
            this.setState({currErrors: 0})
            return;
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
            <div className='create-team-container center'>
                <h1 className='create-team-title'>Create your own team.</h1>
                <form onSubmit={this.onSubmit} className='form-body'>
                    <div className='form-body center'>
                        <label className='create-label input-label'>What's your team's name?</label>
                        <input className='search-input' name='teamName' type='text' 
                            value={this.state.teamName} onChange={this.onChange} />
                        <label className='create-label input-label'>
                            How would you describe your team? Provide a description.
                        </label>
                        <input className='search-input' name='teamDescription' type='text' 
                            value={this.state.teamDescription} onChange={this.onChange} />
                        {
                            // show any errors
                            this.state.currErrors !== -1 ?
                                <p className='error'>{this.possibErrors[this.state.currErrors]}</p>
                                 : null
                        }
                        <input className='btn' type='submit' value='Create your team' />
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