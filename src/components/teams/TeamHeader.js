import React from 'react';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import MembersModal from '../modals/MembersModal';

import './css/TeamHeader.css';

class TeamHeader extends React.Component{
    constructor(){
        super();
        this.state = {
            showModal: false,
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal = () => {this.setState({showModal: true})}

    hideModal = () => {this.setState({showModal: false})}

    render(){
        const {currTeam} = this.props;

        return(
            <div className='team-header-container'>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <h2 className='team-name-title'>{currTeam.teamName}</h2>
                        <h4>{currTeam.teamDescription}</h4>
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

export default TeamHeader;