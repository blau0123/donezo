import React from 'react';

import {getTeamWithId} from '../../redux/actions/teamActions';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import EditNote from './EditNote';

class NotesList extends React.Component{
    constructor(){
        super();
        this.state = {
            currNote:{}
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
                    <Card key={note._id} onClick={() => this.setState({currNote: note})}>
                        <p>Pinned</p>
                        <h4>{note.noteTitle}</h4>
                        <p>{note.noteBody}</p>
                        <p>{note.author}</p>
                    </Card>
                : null
            )
        : null;

        // show all unpinned notes after the pinned notes in the list
        const unpinnedNotesCompon = notesList && notesList.length > 0 ?
            notesList.map(note => 
                !note.pinned ?
                    <Card key={note._id} onClick={() => this.setState({currNote: note})}>
                        <p>Unpinned</p>
                        <h4>{note.noteTitle}</h4>
                        <p>{note.noteBody}</p>
                        <p>{note.author}</p>
                    </Card>
                : null
            )
        : null;
 

        return(
            <div>
                <h1>Notes for {currTeam.teamName}</h1>
                <button onClick={() => this.props.history.goBack()}>Back to team</button>
                <Grid container spacing={2}>
                    <Grid item xs={4} style={{height:'100vh', overflow:'auto'}}>
                        {pinnedNotesCompon}
                        {unpinnedNotesCompon}
                    </Grid>
                    <Grid item xs={8}>
                        <EditNote currNote={this.state.currNote} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
})

export default connect(mapStateToProps, {getTeamWithId})(NotesList);