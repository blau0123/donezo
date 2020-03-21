import React from 'react';
import {connect} from 'react-redux';

// material ui
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import OfflinePinOutlinedIcon from '@material-ui/icons/OfflinePinOutlined';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {deleteNote} from '../../redux/actions/noteActions';

/*
A single note for a given team. The note's id will be sent
to this component, and call a note action that retrieves the note
with the given id
*/
class NoteView extends React.Component{
    onContextItemClick = (evt, data) => {
        // data holds the note that was right clicked
        const teamData = this.props.currTeam;
        console.log(teamData);
        this.props.deleteNote(data.noteData, teamData);
        // reload page to show deletions
        window.location.reload();
    }

    render(){
        const {note, currTeam, setCurrNote} = this.props;
        const lastUpdated = new Date(note.updatedAt);

        return(
            <div key={note._id}>
                <ContextMenuTrigger id={note._id}>
                    <Card className='note-card' key={note._id} 
                        onClick={() => {
                            // if already selected, unselect
                            if (this.state.currNote === note){
                                //this.setState({currNote: null})
                                setCurrNote(null);
                            }
                            //else this.setState({currNote: note})
                            else setCurrNote(note);
                        }}>
                        <Grid container spacing={1}>
                            <Grid item xs={10}>
                                <p className='note-details'>Last updated: {lastUpdated.toLocaleString()}</p>
                            </Grid>
                            <Grid item xs={2}>
                                <OfflinePinOutlinedIcon className='pinned-btn'/>
                            </Grid>
                        </Grid>
                        <h4 className='indiv-note-title'>{note.noteTitle}</h4>
                        <p>{note.noteBody.slice(0, 110)}</p>
                        <p className='note-details note-author'>{note.author}</p>
                        {
                            // show all note tags
                            note.tags && note.tags.length > 0 ? note.tags.map(tag =>
                                <div id={tag._id} key={tag._id} className="sm-tag-container" style={{backgroundColor: tag.color}} onClick={this.deleteTag}>
                                    <p id={tag._id}>{tag.title}</p>   
                                </div>
                            ) : null
                        }
                    </Card>
                </ContextMenuTrigger>
                <ContextMenu id={note._id} className='context-menu-container'>
                    <MenuItem className='context-menu-item' data={{noteData: note}} 
                        onClick={this.onContextItemClick}>
                            Delete
                    </MenuItem>
                </ContextMenu>
            </div>
        )
    }
}

export default connect(null, {deleteNote})(NoteView);