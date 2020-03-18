import React from 'react';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Dropdown from 'react-bootstrap/Dropdown';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MembersModal from '../modals/MembersModal';
import TeamSettingsModal from '../modals/TeamSettingsModal';

import './css/TeamHeader.css';
import { connect } from 'react-redux';

class TeamHeader extends React.Component{
    constructor(){
        super();
        this.state = {
            showMembersModal: false,
            showTeamSettingsModal: false,
            teamSettings:[{id:'sk', text:'Secret Key'}, {id:'et', text:'Edit Team'}, {id:'tags', text:'View Tags'}]
        }
        this.showMembersModal = this.showMembersModal.bind(this);
        this.hideMembersModal = this.hideMembersModal.bind(this);
        this.hideTeamSettingsModal = this.hideTeamSettingsModal.bind(this);
        this.showTeamSettingsModal = this.showTeamSettingsModal.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
    }

    showMembersModal = () => {this.setState({showMembersModal: true})}

    showTeamSettingsModal = () => {this.setState({showTeamSettingsModal: true})}

    hideMembersModal = () => {this.setState({showMembersModal: false})}

    hideTeamSettingsModal = () => {this.setState({showTeamSettingsModal: false})}

    /*
    checks if the user is in the teamMember list of this team
    Used when creating the dropdown menu of teams the user is in
    */
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

    /*
    Given a team and a user, find if the user is an admin in that team
    */
   findIfAdmin(team, user){
        const members = team.teamMembers;
        for (let i = 0; i < members.length; i++){
            if (members[i].user._id === user.id){
                return members[i].isAdmin;
            }
        }
    }

    render(){
        const {currTeam} = this.props;
        const {currUser} = this.props;
        const isAdmin = currTeam.teamMembers ? this.findIfAdmin(currTeam, currUser) : false;
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
                        <Dropdown className="dropdown">
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
                                <PeopleAltIcon className='members-icon scale-hover color-blue' 
                                    onClick={this.showMembersModal} fontSize='large'/>
                                <MembersModal showModal={this.state.showMembersModal} 
                                    handleClose={this.hideMembersModal}
                                    members={currTeam.teamMembers} />
                            </div>
                            <Link to={{pathname:'/chat', state:{currTeam}}}>
                                <ChatIcon className='chat-icon scale-hover color-blue' fontSize='large'/>
                            </Link>
                            {
                                // if user is admin, then show the team options menu
                                isAdmin ? 
                                    <div className='team-options-container'>
                                        <MoreVertIcon className='options-icon scale-hover color-blue' 
                                            fontSize='large' onClick={this.showTeamSettingsModal}/>
                                        <TeamSettingsModal showModal={this.state.showTeamSettingsModal} 
                                            handleClose={this.hideTeamSettingsModal}
                                            currTeam={currTeam}
                                            children={this.state.teamSettings} />
                                    </div> : null
                            }
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