import React from 'react';
import Grid from '@material-ui/core/Grid';

import OfflinePinOutlinedIcon from '@material-ui/icons/OfflinePinOutlined';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

import {updateNote, deleteNote, addNoteToTeam} from '../../redux/actions/noteActions';
import { connect } from 'react-redux';

import './css/EditNote.css';

class EditNote extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: '',
            body: '',
            pinned: false,
            fromChat: false,
            tags: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDeleteNote = this.onDeleteNote.bind(this);
    }

    /*
    When travel to component, will receive props from NotesList (the current note object),
    so this lifecycle allows us to update the state with these incoming props
    */
    componentWillReceiveProps(nextProps){
        // if unselected a note, then set state items to null
        if (nextProps.currNote === null){
            this.setState({
                title: '',
                body: '',
                pinned: false,
            })
            return;
        }

        // when receive props, set the state to the current note
        if (nextProps.currNote !== this.props.currNote){
            this.setState({
                title: nextProps.currNote.noteTitle,
                body: nextProps.currNote.noteBody,
                pinned: nextProps.currNote.pinned,
                fromChat: nextProps.fromChat,
            })
        }
    }

    onSubmit(evt){
        evt.preventDefault();
        const {user} = this.props.auth;

        const noteData = {
            noteTitle: this.state.title,
            noteBody: this.state.body,
            noteId: this.props.currNote._id,
            author: user.firstName + ' ' + user.lastName,
            pinned: this.state.pinned,
        }
        console.log(this.state.fromChat);
        // if have not chosen a note to edit or its a note created from chat, create a new note
        if (Object.entries(this.props.currNote).length === 0 || this.state.fromChat){
            const teamData = this.props.currTeam;
            this.props.addNoteToTeam(teamData, noteData);   
            return;
        }
        
        // update the note in the db if selected a note
        this.props.updateNote(noteData);
    }

    onDeleteNote(evt){
        evt.preventDefault();
        console.log(this.props.currNote);
        this.props.deleteNote(this.props.currNote);
    }

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    render(){
        return(
            <div className='edit-note-container'>
                <form>
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <input type='text' name='title' className='note-title no-border' onChange={this.onChange}
                                value={this.state.title} autoComplete='off' placeholder="What's on your mind?"/>
                        </Grid>
                        <Grid item xs={2}>
                            {
                                this.state.pinned ?
                                    <OfflinePinIcon className='pinned-btn' onClick={evt => {
                                        evt.preventDefault(); 
                                        this.setState({pinned: false})
                                    }}/> :
                                    <OfflinePinOutlinedIcon className='pinned-btn' onClick={evt => {
                                        evt.preventDefault(); 
                                        this.setState({pinned: true})
                                    }} />
                            }
                        </Grid>
                    </Grid>

                    <textarea className='note-body no-border' name='body' rows='12' onChange={this.onChange} 
                        value={this.state.body} placeholder='Starting typing...'/>
                    <button>Add Tags</button>
                    <div className='btn-container'>
                        <button className='submit-btn btn' onClick={this.onSubmit}>Submit</button>
                        <button className='delete-btn btn' onClick={this.onDeleteNote}>Delete</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps, {updateNote, deleteNote, addNoteToTeam})(EditNote);