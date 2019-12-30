import React from 'react';
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

import './HomeNotesList.css';

import {deleteNote} from '../../redux/actions/noteActions';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { connect } from 'react-redux';

class HomeNotesList extends React.Component{
    constructor(){
        super();
        this.onContextItemClick = this.onContextItemClick.bind(this);
    }

    onContextItemClick(evt, data){
        // data holds the note that was right clicked
        const teamData = this.props.currTeam;
        this.props.deleteNote(data.noteData, teamData);
        // reload page to show deletions
        window.location.reload();
    }

    render(){
        const currTeam = this.props.currTeam;

        // get all of the pinned notes for this curr team and make a component
        const notesList = currTeam.teamNotes && currTeam.teamNotes.length > 0 ?
            currTeam.teamNotes.map(note => {
                // get updated at for each note to show time last updated
                const lastUpdated = new Date(note.updatedAt);
                return note.pinned ? 
                    <div key={note._id}>
                        <ContextMenuTrigger id={note._id}>
                            <Card className='home-note-content' onContextMenu={this.rightClickNote}>
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
                            </Card>
                        </ContextMenuTrigger>

                        <ContextMenu id={note._id} className='context-menu-container'>
                            <MenuItem className='context-menu-item' data={{noteData: note}} 
                                onClick={this.onContextItemClick}>
                                Delete
                            </MenuItem>
                        </ContextMenu>
                    </div>
                : null
            }) : <p>No notes yet!</p>;

            return notesList;
    }
}

const mapStateToProps = state => ({
    note: state.note
})

export default connect(mapStateToProps, {deleteNote})(HomeNotesList);