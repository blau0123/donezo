import React from 'react';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card'
import {completeTeamTodo, deleteTeamTodo} from '../../redux/actions/teamActions';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import './css/HomeTodoList.css';
import { connect } from 'react-redux';

// <Link className='edit-todo' to={{pathname: '/edittodo', state:{teamData: currTeam, currTodo: todo}}}>
class HomeTodoList extends React.Component{
    constructor(){
        super();
        this.onContextItemClick = this.onContextItemClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    onContextItemClick(evt, data){
        evt.preventDefault();
        const {todoData} = data;
        const {currTeam} = this.props;

        if (data.type === 'delete'){
            // delete the todo
            this.props.deleteTeamTodo(currTeam, todoData);
        }
        else if (data.type === 'edit'){
            // take the user to edit todo with the todo's info
            this.props.history.push({
                pathname:'/edittodo',
                state: {teamData: currTeam, currTodo: todoData}
            });
        }
    }

    onToggle(evt){
        console.log(evt.target.id, evt.target.value);

        const todoData = {
            id: evt.target.id,
        }
        const {currTeam} = this.props;

        // toggle the todo with this action dispatch
        this.props.completeTeamTodo(currTeam, todoData);
    }

    render(){
        const {currTeam} = this.props;
        console.log(currTeam);
        // get all of the todos for this curr team and make component
        const todosList = currTeam.teamTodos && currTeam.teamTodos.length > 0 ?
            currTeam.teamTodos.map(todo => 
                <div key={todo._id}>
                    <ContextMenuTrigger id={todo._id}>
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
                    </ContextMenuTrigger>

                    <ContextMenu id={todo._id} className='context-menu-container'>
                        <MenuItem id='edit' className='context-menu-item' data={{todoData: todo, type:'edit'}} 
                            onClick={this.onContextItemClick}>
                            Edit
                        </MenuItem>
                        <MenuItem id='delete' className='context-menu-item' data={{todoData: todo, type:'delete'}} 
                            onClick={this.onContextItemClick}>
                            Delete
                        </MenuItem>
                    </ContextMenu>
                </div>
            ) : <p>No todos yet!</p>;
        return todosList;
    }
}

export default connect(null, {deleteTeamTodo, completeTeamTodo})(HomeTodoList);