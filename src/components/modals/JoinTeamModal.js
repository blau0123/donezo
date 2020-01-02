/*
Modal that pops up when user attempts to join a team.
Asks for secret number and if the user enters the correct
secret number, allows the user to join
*/

import React, {useEffect} from 'react';
import Card from '@material-ui/core/Card';

import './css/MembersModal.css';
import './css/SettingsModal.css';
import './css/JoinTeamModal.css';

class JoinTeamModal extends React.Component{
    constructor(){
        super();

        this.state = {
            inputtedNum: '',
            errors: -1,
        }

        this.possibErrors = ['Incorrect secret number'];

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.attemptJoin = this.attemptJoin.bind(this);
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

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    /*
    attempt to join the org if the secret num is correct
    */
    attemptJoin(evt){
        evt.preventDefault();

        // clear any prev errors
        this.setState({errors: -1});

        const {currTeam, joinTeam} = this.props;
        // entered the correct secret num, so let the user join
        if (this.state.inputtedNum === currTeam.secretNum){
            joinTeam(currTeam._id);
            window.location.reload();
        }
        else{
            this.setState({errors: 0})
        }

        // clear out the text input
        this.setState({inputtedNum: ''});
    }

    render(){
        const {showModal, currTeam} = this.props;
        const showModalClass = showModal ? 'join-modal-container' : 'display-none';

        // makes page immovable while modal open
        if (showModal) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';

        return(
            <div className={showModalClass} ref={this.setWrapperRef}>
                <Card className='join-modal-main'>
                    <h2 className='text-center'>{currTeam.teamName}'s secret number.</h2>
                    <div className='input-secret'>
                        <input type='text' name='inputtedNum' value={this.state.inputtedNum} 
                            onChange={this.onChange} className='search-input' /> 
                        <button className='btn' onClick={this.attemptJoin} >Join</button>
                        {
                            this.state.errors > -1 ?
                                <p className='error-text'>{this.possibErrors[this.state.errors]}</p> 
                                : null
                        }
                    </div>
                </Card>
            </div>
        )
    }
}

export default JoinTeamModal;