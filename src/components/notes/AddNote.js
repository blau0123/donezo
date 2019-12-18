import React from 'react';
import { connect } from 'react-redux';
import {addNoteToTeam} from '../../redux/actions/teamActions';
import {addNote} from '../../redux/actions/noteActions';

class AddNote extends React.Component{
    constructor(){
        super();
        this.state = {
            noteTitle: '',
            noteBody: '',
            teamData: {},
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    onSubmit(evt){
        evt.preventDefault();
        // get the current user who is adding the note
        const {user} = this.props.auth;
        // get team data passed in by state from team.js
        const {teamData} = this.props.location.state;

        const noteToAdd = {
            noteTitle: this.state.noteTitle,
            noteBody: this.state.noteBody,
            author: user.id,
        }

        // add note to notes db
        this.props.addNoteToTeam(teamData, noteToAdd);
        this.props.history.push(`/team/${teamData._id}`)
    }

    render(){
        return(
            <div className='container'>
                <form onSubmit={this.onSubmit}>
                    <label>Title</label>
                    <input name='noteTitle' type='text' onChange={this.onChange} value={this.state.noteTitle} />
                    <label>Note</label>
                    <input name='noteBody' type='textarea' onChange={this.onChange} value={this.state.noteBody} />

                    <input type='submit' value='Submit' />
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    // get the state of the note reducer (holds the last added note)
    note: state.note,
})

export default connect(mapStateToProps, {addNote, addNoteToTeam})(AddNote);