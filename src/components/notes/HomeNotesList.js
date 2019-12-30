import React from 'react';
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

class HomeNotesList extends React.Component{
    render(){
        const currTeam = this.props.currTeam;
        // get all of the pinned notes for this curr team and make a component
        const notesList = currTeam.teamNotes && currTeam.teamNotes.length > 0 ?
            currTeam.teamNotes.map(note => {
                // get updated at for each note to show time last updated
                const lastUpdated = new Date(note.updatedAt);
                return note.pinned ? 
                    <Card className='home-note-content' onContextMenu={this.rightClickNote}>
                        <Grid container spacing={1}>
                            <Grid item xs={9}>
                                <p className='note-details'>Last updated: {lastUpdated.toLocaleString()}</p>
                            </Grid>
                            <Grid item xs={2}>
                                <OfflinePinIcon className='pinned-btn'/>
                            </Grid>
                            <Grid item xs={1}>
                                <p className='delete-note-btn'>X</p>
                            </Grid>
                        </Grid>
                        <h6 className='home-note-title'>{note.noteTitle}</h6>
                        <p>{note.noteBody.slice(0, 110)}</p>
                        <p className='note-details note-author'>By, {note.author}</p>
                    </Card>
                : null
            }) : <p>No notes yet!</p>;

            return notesList;
    }
}

export default HomeNotesList;