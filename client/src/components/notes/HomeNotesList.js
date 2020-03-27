import React from 'react';
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import {Link} from 'react-router-dom';

import './css/HomeNotesList.css';

import {deleteNote} from '../../redux/actions/noteActions';
import EditNote from "./EditNote";

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { connect } from 'react-redux';

// modal for editing and adding a note
import ReactModal from 'react-modal';
const modalStyles = {
    content : {
        top : '50%',
        left : '50%',
        right : 'auto',
        bottom : 'auto',
        marginRight : '-50%',
        transform : 'translate(-50%, -50%)'
    }
};
ReactModal.setAppElement('#root')

class HomeNotesList extends React.Component{
    constructor(){
        super();
        this.state = {
            modalOpen: false
        }
        this.onContextItemClick = this.onContextItemClick.bind(this);
    }

    onContextItemClick(evt, data){
        evt.preventDefault();
        // data holds the note that was right clicked
        const teamData = this.props.currTeam;
        this.props.deleteNote(data.noteData, teamData);
        // reload page to show deletions
        window.location.reload();
    }

    render(){
        const currTeam = this.props.currTeam;
        // get the current note selected to show in edit modal
        const {modalOpen} = this.state;

        // get all of the pinned notes for this curr team and make a component
        const notesList = currTeam.teamNotes && currTeam.teamNotes.length > 0 ?
            currTeam.teamNotes.map(note => {
                // get updated at for each note to show time last updated
                const lastUpdated = new Date(note.updatedAt);
                return note.pinned ? 
                    <div key={note._id}>
                        <ReactModal isOpen={modalOpen} onRequestClose={() => this.setState({modalOpen: false})}
                            style={{modalStyles}}>
                            <p className="exit-modal" onClick={() => this.setState({modalOpen: false})}>X</p>
                            <EditNote currNote={note} currTeam={currTeam}/>
                        </ReactModal>
                        <ContextMenuTrigger id={note._id}>
                            { /*
                            <Link to={{pathname:`/noteslist/${currTeam._id}`, state:{currNote: note}}}
                            className='show-note'> */}
                                <Card className='home-note-content' onContextMenu={this.rightClickNote} 
                                    onClick={() => this.setState({modalOpen: true})}>
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
                            {/*</Link>*/}
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