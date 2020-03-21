/*
Shows all untagged notes and tag folders, where the user can click on a 
tag folder to view the notes with that specific tag
*/
import React from "react";
import NoteView from "./NoteView";
import {getTeamWithId} from '../../redux/actions/teamActions';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

// material design
import FolderIcon from '@material-ui/icons/Folder';

import "./css/AllNotes.css";

class AllNotes extends React.Component{
    constructor(){
        super();
        this.state = {
            currNote:{},
            fromChat: false,
        }
    }

    componentDidMount(){
        // get the current team with the passed in id, put into props using redux
        const {teamid} = this.props.match.params;
        // get the team that the user is viewing
        this.props.getTeamWithId(teamid);
    }

    setCurrNote = newCurr => this.setState({currNote: newCurr})

    render(){
        // get the curr team from props (put into props in componentDidMount)
        const {currTeam} = this.props.team;
        // get a list of all tags (will be folders)
        const {teamTags} = currTeam;
        const {teamNotes} = currTeam;

        // get the current note selected
        const {currNote} = this.state;

        return(
            <div className="all-notes-container">
                <h3 className="section-title">Tags</h3>
                <div className="folder">
                {
                    // render all team tags as a folder
                    teamTags && teamTags.length > 0 ? teamTags.map(tag => 
                        <Link to={{
                                pathname: `/team/${currTeam._id}/notes/tag/${tag._id}`,
                                state: { currTeam, tag }
                            }} key={tag._id} className="tag-folder-link">
                            <p className="tag-folder-item">
                                <FolderIcon className="folder-icon"/>
                                {tag.title}
                            </p>
                        </Link>
                    ) : null
                }
                </div>
                <h3 className="section-title">Untagged notes</h3>
                <div className="untagged-notes">
                {
                    // render all untagged notes
                    teamNotes && teamNotes.length > 0 ? teamNotes.map(note => 
                        note.tags.length === 0 ? 
                            <NoteView key={note._id} currTeam={currTeam} note={note} setCurrNote={this.setCurrNote} />
                            : null
                    ) : <p>No notes to show!</p>
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
    note: state.note,
})

export default connect(mapStateToProps, {getTeamWithId})(AllNotes);