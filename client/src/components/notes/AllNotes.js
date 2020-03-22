/*
Shows all untagged notes and tag folders, where the user can click on a 
tag folder to view the notes with that specific tag
*/
import React from "react";
import NoteView from "./NoteView";
import EditNote from "./EditNote";
import {getTeamWithId} from '../../redux/actions/teamActions';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

// material design
import FolderIcon from '@material-ui/icons/Folder';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import "./css/AllNotes.css";

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

class AllNotes extends React.Component{
    constructor(){
        super();
        this.state = {
            currNote:{},
            fromChat: false,
            modalOpen: false
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

        // get the current note selected to show in edit modal
        const {currNote, modalOpen} = this.state;
        console.log(modalOpen);
        return(
            <div className="all-notes-container" id="all-notes-container">
                <ReactModal isOpen={modalOpen} onRequestClose={() => this.setState({modalOpen: false})}
                    style={{modalStyles}}>
                    <p className="exit-modal" onClick={() => this.setState({modalOpen: false})}>X</p>
                    <EditNote currNote={currNote} currTeam={currTeam} fromChat={this.state.fromChat}/>
                </ReactModal>

                <div className="header-container">
                    <ArrowBackIosIcon fontSize='large' className='back-btn' 
                        onClick={() => this.props.history.goBack()} />
                    <h1 className="header-text">Notes</h1>
                    <button className="add-btn" onClick={() => this.setState({modalOpen: true})}>Add</button>
                </div>
                
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
                            <div onClick={() => this.setState({modalOpen: true})}>
                                <NoteView key={note._id} currTeam={currTeam} note={note} currNote={this.state.currNote} 
                                    setCurrNote={this.setCurrNote}/>
                            </div>
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