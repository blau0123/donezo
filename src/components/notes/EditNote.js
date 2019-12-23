import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {updateNote} from '../../redux/actions/noteActions';
import { connect } from 'react-redux';

class EditNote extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: '',
            body: '',
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
            })
        }
    }

    onSubmit(evt){
        evt.preventDefault();
        const noteData = {
            noteTitle: this.state.title,
            noteBody: this.state.body,
            noteId: this.props.currNote._id,
        }
        console.log(noteData);
        // update the note in the db
        this.props.updateNote(noteData);
    }

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    render(){
        return(
            <div style={{height:'100vh'}}>
                <form>
                    <TextField name='title' style={{width:'100%'}} id='standard-uncontrolled' value={this.state.title} 
                        onChange={this.onChange}/>
                    <TextField name='body' style={{width:'100%'}} id='outlined-uncontrolled' multiline
                        value={this.state.body} rows={25} variant='outlined' onChange={this.onChange}/>
                    <Button variant='contained' color='primary' onClick={this.onSubmit}
                        disableElevation>Submit</Button>
                </form>
            </div>
        )
    }
}

export default connect(null, {updateNote})(EditNote);