import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dropdown from 'react-bootstrap/Dropdown';

import OfflinePinOutlinedIcon from '@material-ui/icons/OfflinePinOutlined';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

import {updateNote, deleteNote, addNoteToTeam} from '../../redux/actions/noteActions';
import { connect } from 'react-redux';

import './css/EditNote.css';

class EditNote extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: '',
            body: '',
            pinned: false,
            fromChat: false,
            tags: [],
            selectedTag:{}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDeleteNote = this.onDeleteNote.bind(this);
    }

    /*
    When travel to component, will receive props from NotesList (the current note object),
    so this lifecycle allows us to update the state with these incoming props
    */
    componentWillReceiveProps(nextProps){
        // if unselected a note, then set state items to null
        if (nextProps.currNote === null){
            this.setState({
                title: '',
                body: '',
                pinned: false,
            })
            return;
        }

        // when receive props, set the state to the current note
        if (nextProps.currNote !== this.props.currNote){
            this.setState({
                title: nextProps.currNote.noteTitle,
                body: nextProps.currNote.noteBody,
                pinned: nextProps.currNote.pinned,
                tags: nextProps.currNote.tags,
                fromChat: nextProps.fromChat,
            })
        }
    }

    selectTag = evt => {
        console.log(evt);
        this.setState({selectedTag: evt.target.innerText})
    }

    deleteTag = evt => {
        // find tag with the id in list of tags
        const {id} = evt.target;

        this.setState(prevState => {
            const {tags} = prevState;

            for (let i = 0; i < tags.length; i++){
                // remove the tag
                if (tags[i]._id === id){
                    console.log(tags[i])
                    tags.splice(i, 1);
                }
            }

            return {tags};
        });
    }

    addTag = evt => {
        evt.preventDefault();
        // get the tag then put into array of tags
        const tag = document.getElementById("select-tag").value;        

        // check if tag is already added and make sure no more than 3 tags are added
        const {tags} = this.state;
        if (tags.length >= 3){
            alert("You can only add up to 3 tags");
            return;
        }

        for (let i = 0; i < tags.length; i++){
            if (tags[i].title === tag){
                alert("You already added this tag");
                return;
            }
        }

        // find the tag in the list of tags (since all tag titles are unique) to get full object
        const {currTeam} = this.props;
        const {teamTags} = currTeam;
        let selTag = {}
        for (let i = 0; i < teamTags.length; i++){
            if (teamTags[i].title === tag){
                selTag = teamTags[i];
                break;
            }
        }

        this.setState(prevState => {
             // add newly typed tag to tag list
             const tags = prevState.tags.concat(selTag);
             return {tags}
        })
    }

    onSubmit(evt){
        evt.preventDefault();
        const {user} = this.props.auth;

        const noteData = {
            noteTitle: this.state.title,
            noteBody: this.state.body,
            noteId: this.props.currNote._id,
            author: user.firstName + ' ' + user.lastName,
            pinned: this.state.pinned,
            tags: this.state.tags,
        }
        console.log(this.state.fromChat);
        // if have not chosen a note to edit or its a note created from chat, create a new note
        if (Object.entries(this.props.currNote).length === 0 || this.state.fromChat){
            const teamData = this.props.currTeam;
            this.props.addNoteToTeam(teamData, noteData);   
            return;
        }
        
        // update the note in the db if selected a note
        this.props.updateNote(noteData);
    }

    onDeleteNote(evt){
        evt.preventDefault();
        console.log(this.props.currNote);
        this.props.deleteNote(this.props.currNote);
    }

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    render(){
        const {currTeam} = this.props;
        const {tags} = this.state;
        console.log(tags);

        const tagDropdownItems = currTeam.teamTags && currTeam.teamTags.length > 0 ?
            currTeam.teamTags.map(tag => {
                // return the dropdown item for that specific tag
                return(
                   <option value={tag.title} key={tag._id} className="tag-option">{tag.title}</option>
                )
            }) : null;

        return(
            <div className='edit-note-container'>
                <form>
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <input type='text' name='title' className='note-title no-border' onChange={this.onChange}
                                value={this.state.title} autoComplete='off' placeholder="What's on your mind?"/>
                        </Grid>
                        <Grid item xs={2}>
                            {
                                this.state.pinned ?
                                    <OfflinePinIcon className='pinned-btn' onClick={evt => {
                                        evt.preventDefault(); 
                                        this.setState({pinned: false})
                                    }}/> :
                                    <OfflinePinOutlinedIcon className='pinned-btn' onClick={evt => {
                                        evt.preventDefault(); 
                                        this.setState({pinned: true})
                                    }} />
                            }
                        </Grid>
                    </Grid>

                    <textarea className='note-body no-border' name='body' rows='12' onChange={this.onChange} 
                        value={this.state.body} placeholder='Starting typing...'/>
                    
                    <div className="select-tag-container">
                        {
                            // show the selected tags
                            tags && tags.length > 0 ? tags.map(tag => 
                                <div id={tag._id} key={tag._id} className="tagContainer added-tag" style={{backgroundColor: tag.color}} onClick={this.deleteTag}>
                                    <p id={tag._id}>{tag.title}</p>   
                                </div> ) : null
                        }
                        <select className="select-tag" id="select-tag">
                            {tagDropdownItems}
                        </select>
                        <button onClick={this.addTag} className="btn">Add</button>
                    </div>

                    <div className='btn-container'>
                        <button className='submit-btn btn' onClick={this.onSubmit}>Submit</button>
                        <button className='delete-btn btn' onClick={this.onDeleteNote}>Delete</button>
                    </div>
                </form>
            </div>
        )
    }
}

/*
 <Dropdown>
    <Dropdown.Toggle variant='primary'>
        {this.state.selectedTag.title ? this.state.selectedTag.title : "Add a tag"}
    </Dropdown.Toggle>
    <Dropdown.Menu>
        {tagDropdownItems}
    </Dropdown.Menu>
</Dropdown>
*/
const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps, {updateNote, deleteNote, addNoteToTeam})(EditNote);