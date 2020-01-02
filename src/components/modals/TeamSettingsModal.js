import React, {useEffect} from 'react';
import Card from '@material-ui/core/Card';
import {withRouter} from 'react-router-dom';

import './css/MembersModal.css';
import './css/SettingsModal.css';
import './css/TeamSettingsModal.css';

const SECRET_KEY_TEXT = 'Secret Key';

class TeamSettingsModal extends React.Component{
    constructor(){
        super();

        this.state = {
            secretNumText: SECRET_KEY_TEXT
        }

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount(){
        // set event listener for checking if mouse click outside of modal
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount(){
        //document.body.style.overflow = 'unset';
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /*
    set the wrapper ref for the modal so we can check if there
    was a mouse click outside of the modal to close the modal
    */
    setWrapperRef(node){
        this.wrapperRef = node;
    }

    /*
    whenever click, checks if the click was inside or outside modal
    */
    handleOutsideClick(evt){
        const {showModal, handleClose} = this.props;

        // clicked outside of modal, so close modal
        if (showModal && this.wrapperRef && !this.wrapperRef.contains(evt.target)) {
            handleClose();
        }
    }

    onClick(evt){
        evt.preventDefault();

        const {currTeam} = this.props;
        // if user wants to view secret number
        if (evt.target.id === 'sk'){
            // show the user the secret number
            if (this.state.secretNumText === SECRET_KEY_TEXT){
                this.setState({secretNumText: currTeam.secretNum})
            }
            else this.setState({secretNumText: SECRET_KEY_TEXT});
        }
        // if the user wants to edit the team
        else if (evt.target.id === 'et'){
            // bring user to edit team page with the curr team's data
            this.props.history.push({
                pathname:'/editteam',
                state: {currTeam: currTeam}
            })
        }
    }

    render(){
        const {showModal, children} = this.props;
        const showModalClass = showModal ? 'member-modal-container' : 'display-none';

        // makes page immovable while modal open
        if (showModal) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';

        return(
            <div className={showModalClass} ref={this.setWrapperRef}>
                <Card className='team-set-modal-main'>
                    <p className='member-title'>Team Settings</p>
                    {
                        children && children.length > 0 ? children.map(child => 
                            <p id={child.id} key={child.id} className='member-name child-name'
                                onClick={this.onClick}>
                                    {
                                        child.id === 'sk' ?
                                            this.state.secretNumText : child.text
                                    }
                            </p>
                        ) : null
                    }
                </Card>
            </div>
        )
    }
}

export default withRouter(TeamSettingsModal);