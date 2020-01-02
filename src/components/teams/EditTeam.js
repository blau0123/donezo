import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Grid from '@material-ui/core/Grid';

import './css/EditTeam.css';

import { editTeam } from '../../redux/actions/teamActions';
import { connect } from 'react-redux';

class EditTeam extends React.Component{
    constructor(){
        super();

        this.state = {
            teamName: '',
            teamDescription: '',
            secretNum: '',
            updated: false,
        }

        this.onChange = this.onChange.bind(this);
        this.onEditTeam = this.onEditTeam.bind(this);
    }

    componentDidMount(){
        console.log(this.props.location)
        const {currTeam} = this.props.location.state;
        this.setState({
            teamId: currTeam._id, 
            teamName: currTeam.teamName,
            teamDescription: currTeam.teamDescription,
            secretNum: currTeam.secretNum,
        })
    }

    onChange(evt){
        this.setState({[evt.target.name]: evt.target.value})
    }

    onEditTeam(evt){
        evt.preventDefault();

        // call redux action to edit the team
        const teamData = this.state;
        this.props.editTeam(teamData);
        this.setState({updated: true});
    }

    render(){
        return(
            <div className='edit-team-container'>
                <div className='back-title'>
                    <ArrowBackIosIcon fontSize='large' className='edit-back' 
                        onClick={() => this.props.history.goBack()} />
                
                    <h1 className='edit-team-title'>Change up your team.</h1>
                </div>
                   
                <label className='input-label'>Name</label>
                <input className='search-input' type='text' name='teamName'
                    onChange={this.onChange} value={this.state.teamName} />
                <label className='input-label'>Description</label>
                <input className='search-input' type='text' name='teamDescription'
                    onChange={this.onChange} value={this.state.teamDescription} />
                <label className='input-label'>Secret Number</label>
                <input className='search-input' type='text' name='secretNum'
                    onChange={this.onChange} value={this.state.secretNum} />
                {
                    this.state.updated ? <p>Your team has been updated.</p> : null
                }
                <button className='btn' onClick={this.onEditTeam}>Submit</button>
            </div>
        )
    }
}

export default connect(null, {editTeam})(EditTeam);