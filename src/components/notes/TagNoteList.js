/*
/:teamid/notes/:tagid

Shows a list of all notes with a given tag
*/
import React from "react";
import NoteView from "./NoteView";

// material ui
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import "./css/AllNotes.css";

class TagNoteList extends React.Component{
    constructor(){
        super();
        this.state = {
            currNote: {}
        }
    }

    /*
        Given a list of notes, find all notes with the given tag
    */
    findNotesWithTag = (notes, tagid) => {
        let notesWithTag = [];
        for (let i = 0; i < notes.length; i++){
            // go through tags list for this note (will be no more than 3)
            for (let j = 0; j < notes[i].tags.length; j++){
                if (notes[i].tags[j]._id.toString() === tagid){
                    notesWithTag.push(notes[i]);
                    break;
                }
            }
        }
        return notesWithTag;
    }

    setCurrNote = newCurr => this.setState({currNote: newCurr})

    render(){
        // get the current team from passed props and tag id
        const { currTeam, tag } = this.props.location.state;
        const { tagid } = this.props.match.params;
        const notesWithTag = this.findNotesWithTag(currTeam.teamNotes, tagid); 
        console.log(this.props.location.state);

        return(
            <div className="all-notes-container">
                 <div className="header-container">
                    <ArrowBackIosIcon fontSize='large' className='back-btn' 
                        onClick={() => this.props.history.goBack()} />
                    <h1 className="section-title">tags/{tag.title}</h1>
                </div>

                <div style={{display: "flex", flexWrap: "wrap"}}>
                {
                    // render all notes with the passed in tag
                    notesWithTag && notesWithTag.length > 0 ? notesWithTag.map(note => 
                        <NoteView key={note._id} currTeam={currTeam} note={note} currNote={this.state.currNote}
                            setCurrNote={newCurr => this.setState({currNote: newCurr})} />
                ) : <p>No notes exist with this tag</p>
                }
                </div>
            </div>
        )
    }
}

export default TagNoteList;