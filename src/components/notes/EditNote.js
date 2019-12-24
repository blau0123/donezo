import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {updateNote, deleteNote} from '../../redux/actions/noteActions';
import { connect } from 'react-redux';

class EditNote extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: '',
            body: '',
            pinned: false,
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
        // when receive props, set the state to the current note
        if (nextProps.currNote !== this.props.currNote){
            this.setState({
                title: nextProps.currNote.noteTitle,
                body: nextProps.currNote.noteBody,
                pinned: nextProps.currNote.pinned,
            })
        }
    }

    onSubmit(evt){
        evt.preventDefault();
        const noteData = {
            noteTitle: this.state.title,
            noteBody: this.state.body,
            noteId: this.props.currNote._id,
            pinned: this.state.pinned,
        }
        console.log(noteData);
        
        // update the note in the db
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
            <div style={{height:'100vh'}}>
                {
                    this.state.pinned ?
                        <button onClick={() => this.setState({pinned: false})}>Pinned!</button> :
                        <button onClick={() => this.setState({pinned: true})}>Unpinned</button>
                }
                <form>
                    <TextField name='title' style={{width:'100%'}} id='standard-uncontrolled' value={this.state.title} 
                        onChange={this.onChange}/>
                    <TextField name='body' style={{width:'100%'}} id='outlined-uncontrolled' multiline
                        value={this.state.body} rows={25} variant='outlined' onChange={this.onChange}/>
                    <Button variant='contained' color='primary' onClick={this.onSubmit}
                        disableElevation>Submit</Button>
                    <Button variant='contained' color='primary' onClick={this.onDeleteNote}
                        disableElevation>Delete</Button>
                </form>
            </div>
        )
    }
}

export default connect(null, {updateNote, deleteNote})(EditNote);