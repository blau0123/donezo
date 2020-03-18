import React from "react";
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import {Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';

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

    findTodosWithTag = (todosList, search) => {
        let todosWithTag = [];
        for (let i = 0; i < todosList.length; i++){
            // go through tags for this note
            if (todosList[i] && todosList[i].tags){
                for (let j = 0; j < todosList[i].tags.length; j++){
                    // if search result is contained in the tag, then this note is a result
                    if (todosList[i].tags[j].title.includes(search)){
                        todosWithTag.push(todosList[i]);
                        break;
                    }
                }
            }
        }
        return todosWithTag;
    }

    render(){
        const {currTeam, search} = this.props;
        // search for notes with a given tag searched
        const notesWithTag = this.findNotesWithTag(currTeam.teamNotes, search);
        const todosWithTag = this.findTodosWithTag(currTeam.teamTodos, search);

        const searchedNotesComponent =  notesWithTag && notesWithTag.length > 0 ? notesWithTag.map(note => {
            // get updated at for each note to show time last updated
            const lastUpdated = new Date(note.updatedAt);
            return(
                <Link to={{pathname:`/noteslist/${currTeam._id}`, state:{currNote: note}}}
                    className='show-note' key={note._id}>
                    <Card className='home-note-content with-tag'>
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
        }) : <p>No notes with this tag.</p>;

        const searchedTodosComponent = todosWithTag && todosWithTag.length > 0 ? todosWithTag.map(todo => 
            <div className="with-tag" key={todo._id}>
                <Card className='todo-container' key={todo._id}>
                    <Form>
                        <Form.Check 
                            custom
                            className='todo-check-form'
                            type='checkbox'
                            id={todo._id}
                            label={todo.todoText}
                            checked={todo.isCompleted}
                            onChange={this.onToggle}/>
                    </Form>
                    <p>Assigned: 
                        {
                            todo.assignee && todo.assignee.length > 0 ? ' ' + todo.assignee : 'None'
                        }
                    </p>
                    {
                        // show all todo tags
                        todo.tags && todo.tags.length > 0 ? todo.tags.map(tag =>
                            <div id={tag._id} key={tag._id} className="sm-tag-container todo-tag" style={{backgroundColor: tag.color}} onClick={this.deleteTag}>
                                <p id={tag._id}>{tag.title}</p>   
                            </div>
                        ) : null
                    }
                </Card>
            </div>
        ) : <p>No todos with this tag.</p>

        return(
            <div className="search-result-container">
                <div className="with-tag">
                    {searchedNotesComponent}
                </div>
                <div className="with-tag">
                    {searchedTodosComponent}
                </div>
            </div>
        )
    }
}

export default SearchResults;