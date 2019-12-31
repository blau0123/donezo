import React from 'react';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Dropdown from 'react-bootstrap/Dropdown';

import MembersModal from '../modals/MembersModal';

import './css/TeamHeader.css';
import { connect } from 'react-redux';

class TeamHeader extends React.Component{
    constructor(){
        super();
        this.state = {
            showModal: false,
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
    }

    showModal = () => {this.setState({showModal: true})}

    hideModal = () => {this.setState({showModal: false})}

    /*
    checks if the user is in the teamMember list of this team
    */
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

    render(){
        const {currTeam} = this.props;

         // have all dropdown items be teams user is in
         const {teamsList} = this.props.team;
         const teamDropdownItems = teamsList && teamsList.length > 0 ?
             teamsList.map(team => {
                 // need to check if the user is in a certain team or not
                 const userIsInTeam = this.isUserInTeam(team);
                 // if the user is in the team, show it and if not don't show the team
                 return (userIsInTeam ? 
                         <Dropdown.Item key={team._id}>
                             <Link to={{
                                 pathname: `/team/${team._id}`, 
                                 state: {teamId: team._id}
                             }}>{team.teamName}</Link>
                         </Dropdown.Item>
                     : null)
                 
             }) : null;

        return(
            <div className='team-header-container'>
                <Link to='/' className='home-btn'>Home</Link>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Dropdown>
                            <Dropdown.Toggle variant='primary' id='team-selector' className='team-name-title'>
                                {
                                    // decide if the user is on a team or if the user hasn't selected a team yet
                                    this.props.team.teamsList.length > 0 ? this.props.team.currTeam.teamName : "Select Team"
                                }
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {teamDropdownItems}
                            </Dropdown.Menu>
                        </Dropdown>
                        <h4 className='team-desc'>{currTeam.teamDescription}</h4>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='members-chat'>
                            <div className="members-container">
                                <PeopleAltIcon className='members-icon' onClick={this.showModal}
                                    fontSize='large'/>
                                <MembersModal showModal={this.state.showModal} handleClose={this.hideModal}
                                    members={currTeam.teamMembers}></MembersModal>
                            </div>
                            <Link to={{pathname:'/chat', state:{currTeam}}}>
                                <ChatIcon className='chat-icon' fontSize='large'/>
                            </Link>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
})

export default connect(mapStateToProps, null)(TeamHeader);