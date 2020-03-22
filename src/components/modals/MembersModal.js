import React, {useEffect} from 'react';
import Card from '@material-ui/core/Card';

import './css/MembersModal.css';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

class MembersModal extends React.Component{
    constructor(){
        super();

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
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

    /*
    Handles when a context item (right clicking on a user) is clicked
    */
    onContextItemClick(evt, data){
        evt.preventDefault();
        console.log(data)
    }

    render(){
        const {showModal, handleClose, members} = this.props;
        const showModalClass = showModal ? 'member-modal-container' : 'display-none';

        // makes page immovable while modal open
        if (showModal) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';

        const memberContext = (member) => (
            <div key={member.user._id}>
                <ContextMenuTrigger id={member.user._id}>
                    {
                        member.isAdmin ? 
                            <p key={member.user._id} className='member-name admin'>
                                {member.user.firstName + ' ' + member.user.lastName} (Admin)
                            </p> :
                            <p key={member.user._id} className='member-name'>
                                {member.user.firstName + ' ' + member.user.lastName}
                            </p>
                    }
                </ContextMenuTrigger>

                <ContextMenu id={member.user._id} className='memb-context-menu'>
                    <MenuItem className='context-menu-item' data={{userData: member}} 
                        onClick={this.onContextItemClick}>
                        Make Admin
                    </MenuItem>
                </ContextMenu>
            </div>
        )

        return(
            <div className={showModalClass} ref={this.setWrapperRef}>
                <Card className='modal-main'>
                    <p className='member-title'>Members</p>
                    {
                        members && members.length > 0 ? members.map(member => 
                            memberContext(member)      
                        ) : null
                    }
                </Card>
            </div>
        )
    }
}

export default MembersModal;