import React from "react";
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import {Link} from 'react-router-dom';

import "./css/Team.css";

class SearchResults extends React.Component{
    findNotesWithTag = (notesList, search) => {
        let notesWithTag = [];
        for (let i = 0; i < notesList.length; i++){
            // go through tags for this note
            if (notesList[i] && notesList[i].tags){
                for (let j = 0; j < notesList[i].tags.length; j++){
                    // if search result is contained in the tag, then this note is a result
                    if (notesList[i].tags[j].title.includes(search)){
                        notesWithTag.push(notesList[i]);
                        break;
                    }
                }
            }
        }
        return notesWithTag;
    }

    render(){
        const {currTeam, search} = this.props;
        // search for notes with a given tag searched
        const notesWithTag = this.findNotesWithTag(currTeam.teamNotes, search);

        return(
            <div className="search-result-container">
                {
                    // render all of the notes that the user searched for
                    notesWithTag && notesWithTag.length > 0 ? notesWithTag.map(note => {
                        // get updated at for each note to show time last updated
                        const lastUpdated = new Date(note.updatedAt);
                        return(
                            <Link to={{pathname:`/noteslist/${currTeam._id}`, state:{currNote: note}}}
                                className='show-note' key={note._id}>
                                <Card className='home-note-content'>
                                    <Grid container spacing={1}>
                                        <Grid item xs={10}>
                                            <p className='note-details'>Last updated: {lastUpdated.toLocaleString()}</p>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <OfflinePinIcon className='pinned-btn'/>
                                        </Grid>
                                    </Grid>
                                    <h6 className='home-note-title'>{note.noteTitle}</h6>
                                    <p>{note.noteBody.slice(0, 110)}</p>
                                    <p className='note-details note-author'>By, {note.author}</p>
                                    {
                                        // show all note tags
                                        note.tags && note.tags.length > 0 ? note.tags.map(tag =>
                                            <div id={tag._id} key={tag._id} className="sm-tag-container" style={{backgroundColor: tag.color}} onClick={this.deleteTag}>
                                                <p id={tag._id}>{tag.title}</p>   
                                            </div>
                                        ) : null
                                    }
                                </Card>
                            </Link>
                        )
                    }) : null
                }
            </div>
        )
    }
}

export default SearchResults;