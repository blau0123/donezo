import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Grid from '@material-ui/core/Grid';
import GradeIcon from '@material-ui/icons/Grade';
import GradeOutlinedIcon from '@material-ui/icons/GradeOutlined';

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
            teamMembers: [],
            updated: false,
        }

        this.onChange = this.onChange.bind(this);
        this.onEditTeam = this.onEditTeam.bind(this);
        this.setAdmin = this.setAdmin.bind(this);
    }

    componentDidMount(){
        console.log(this.props.location)
        const {currTeam} = this.props.location.state;
        this.setState({
            teamId: currTeam._id, 
            teamName: currTeam.teamName,
            teamDescription: currTeam.teamDescription,
            teamMembers: currTeam.teamMembers,
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

        // go through team members and ensure that at least one is admin
        const members = teamData.teamMembers;
        let numAdmin = 0;
        for (let i = 0; i < members.length; i++){
            if (members[i].isAdmin){
                numAdmin++;
            }
        }
        // no admin, so don't let the user edit
        if (numAdmin === 0){
            alert("You must have at least one admin");
            return;
        }

        this.props.editTeam(teamData);
        this.setState({updated: true});
    }

    setAdmin(evt, isAdmin, member){
        evt.preventDefault();

        let tempMembers = this.state.teamMembers;
        // if is admin, then need to change to not admin & vice versa
        for (let i = 0; i < tempMembers.length; i++){
            if (tempMembers[i].user._id === member.user._id){
                // change isadmin
                tempMembers[i].isAdmin = !isAdmin;
                break;
            }
        }
      
        this.setState({teamMembers: tempMembers});
    }

    render(){
        return(
            <div className='edit-team-container'>
                <div className='back-title'>
                    <ArrowBackIosIcon fontSize='large' className='edit-back' 
                        onClick={() => this.props.history.goBack()} />
                
                    <h1 className='edit-team-title'>Change up your team.</h1>
                </div>
                   
                <Grid container spacing={2} className='edit-separator'>
                    <Grid item md={10} sm={12} className='edit-team-container edit-items'>
                        <label className='input-label'>Name</label>
                        <input className='edit-search-input' type='text' name='teamName'
                            onChange={this.onChange} value={this.state.teamName} />
                        <label className='input-label'>Description</label>
                        <input className='edit-search-input' type='text' name='teamDescription'
                            onChange={this.onChange} value={this.state.teamDescription} />
                        <label className='input-label'>Secret Number</label>
                        <input className='edit-search-input' type='text' name='secretNum'
                            onChange={this.onChange} value={this.state.secretNum} />
                    </Grid>
                    <Grid item md={2} xs={12} className='members-edit-list'>
                        <label className='input-label'>Members</label>
                        {
                            // team members edit
                            this.state.teamMembers && this.state.teamMembers.length > 0 ? this.state.teamMembers.map(member =>
                                <div className='edit-member-admin'>
                                    {
                                        member.isAdmin ? 
                                            <GradeIcon id='is-admin' className='admin color-blue scale-hover' fontSize='small' 
                                                onClick={evt => this.setAdmin(evt, true, member)}/> : 
                                            <GradeOutlinedIcon id='not-admin' className='admin color-blue scale-hover' 
                                                fontSize='small' onClick={evt => this.setAdmin(evt, false, member)}/>
                                    }
                                    <p>{member.user.firstName + ' ' + member.user.lastName}</p>   
                                </div> 
                            ) : null
                        }
                    </Grid>
                </Grid>
                {
                    this.state.updated ? <p>Your team has been updated.</p> : null
                }
                <button className='btn edit-team-btn' onClick={this.onEditTeam}>Submit</button>
            </div>
        )
    }
}

export default connect(null, {editTeam})(EditTeam);