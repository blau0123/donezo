import React from 'react';

import {getTeamWithId} from '../../redux/actions/teamActions';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import OfflinePinOutlinedIcon from '@material-ui/icons/OfflinePinOutlined';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import EditNote from './EditNote';

import './NotesList.css';

class NotesList extends React.Component{
    constructor(){
        super();
        this.state = {
            currNote:{}
        }
    }

    componentDidUpdate(prevProps){
        // if added a note, then should refresh to show new note
        if (this.props.note.lastAddedNote != prevProps.note.lastAddedNote){
            window.location.reload();
        }
    }

    componentDidMount(){
        // get the current team and store in state
        const {id} = this.props.match.params;
        // get the team that the user is viewing
        this.props.getTeamWithId(id);
    }

    render(){
        const {currTeam} = this.props.team;
        //console.log(currTeam);

        // make a component to show all notes
        const notesList = currTeam.teamNotes;
        const pinnedNotesCompon = notesList && notesList.length > 0 ?
            notesList.map(note => 
                note.pinned ?
                    // if this is the note that the user is viewing in edit, outline it
                    this.state.currNote === note ?
                        <Card key={note._id} onClick={() => {
                            // if already selected, unselect
                            if (this.state.currNote === note){
                                this.setState({currNote: null})
                            }
                            else this.setState({currNote: note})
                        }}
                            className='note-card selected'>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <h4>{note.noteTitle}</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <OfflinePinIcon className='pinned-btn'/>
                                </Grid>
                            </Grid>
                            <p>{note.noteBody.slice(0, 110)}</p>
                            <p>{note.author}</p>
                        </Card> :
                        <Card className='note-card' key={note._id} 
                            onClick={() => {
                                // if already selected, unselect
                                if (this.state.currNote === note){
                                    this.setState({currNote: null})
                                }
                                else this.setState({currNote: note})
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <h4>{note.noteTitle}</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <OfflinePinIcon className='pinned-btn'/>
                                </Grid>
                            </Grid>
                            <p>{note.noteBody.slice(0, 110)}</p>
                            <p>{note.author}</p>
                    </Card>
                : null
            )
        : null;

        // show all unpinned notes after the pinned notes in the list
        const unpinnedNotesCompon = notesList && notesList.length > 0 ?
            notesList.map(note => 
                !note.pinned ?
                    // if this is the note that the user is viewing in edit, outline it
                    this.state.currNote === note ? 
                        <Card key={note._id} onClick={() => {
                            // if already selected, unselect
                            if (this.state.currNote === note){
                                this.setState({currNote: null})
                            }
                            else this.setState({currNote: note})
                        }}
                            className='note-card selected'>
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <h4>{note.noteTitle}</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <OfflinePinOutlinedIcon className='pinned-btn mr-5'/>
                                </Grid>
                            </Grid>
                            <p>{note.noteBody.slice(0, 110)}</p>
                            <p>{note.author}</p>
                        </Card> :
                        <Card className='note-card' key={note._id} 
                            onClick={() => {
                                // if already selected, unselect
                                if (this.state.currNote === note){
                                    this.setState({currNote: null})
                                }
                                else this.setState({currNote: note})
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <h4>{note.noteTitle}</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <OfflinePinOutlinedIcon className='pinned-btn'/>
                                </Grid>
                            </Grid>
                            <p>{note.noteBody.slice(0, 110)}</p>
                            <p>{note.author}</p>
                        </Card>
                : null
            )
        : null;
 

        return(
            <div className='total-notes-container'>
                <Grid container spacing={2}>
                    <Grid item xs={1}>
                        <ArrowBackIosIcon className='back-btn' onClick={() => this.props.history.push(`/team/${currTeam._id}`)} />
                    </Grid>
                    <Grid item xs={11}>
                        <h1 className='note-list-title'>Notes for {currTeam.teamName}</h1>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid className='note-list-container 'item xs={4}>
                        {pinnedNotesCompon}
                        {unpinnedNotesCompon}
                    </Grid>
                    <Grid item xs={8}>
                        <EditNote currNote={this.state.currNote} currTeam={currTeam}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
    note: state.note,
})

export default connect(mapStateToProps, {getTeamWithId})(NotesList);