import React from 'react';
import { connect } from 'react-redux';
import {addTodoToTeam} from '../../redux/actions/teamActions';
import Dropdown from 'react-bootstrap/Dropdown';

import './AddTodo.css';

class AddTodo extends React.Component{
    constructor(){
        super();
        this.state = {
            todoText: '',
            assignee: '',
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmitTodo = this.onSubmitTodo.bind(this);
    }

    componentDidMount(){
        // if came from a message, then set the body to the message
        if (this.props.location.state){
            this.setState({
                todoText: this.props.location.state.todoText
            })
        }
    }

    onChange(evt){
        this.setState({todoText: evt.target.value});
    }

    onSubmitTodo(evt){
        evt.preventDefault();

        const {teamData} = this.props.location.state;
        const {user} = this.props.auth;
        const todoData = {
            todoText: this.state.todoText,
            isCompleted: false,
            assignee: this.state.assignee,
            author: user.firstName + ' ' + user.lastName,
        }

        // add todo to team and redirect back to the team home
        this.props.addTodoToTeam(teamData, todoData);
        //this.props.history.push(`/team/${teamData._id}`);
        this.props.history.goBack();
    }

    render(){
        // get current team
        const {teamData} = this.props.location.state;
        const membersList = teamData.teamMembers;
        
        // dropdown of all members in curr team to choose an assignee
        const memberDropdownItems = membersList && membersList.length > 0 ?
            membersList.map(member => 
                <Dropdown.Item key={member._id}
                    onClick={() => this.setState({assignee: `${member.firstName} ${member.lastName}`})}>
                    {member.firstName + ' ' + member.lastName}
                </Dropdown.Item> 
            ) : null;

        return(
            <div className='edit-todo-container'>
                <h1 className='edit-todo-title'>What do you want to accomplish?</h1>
                <form className='edit-todo-form'>
                    <input className='todo-input' name='todoText' type='text' 
                        onChange={this.onChange} value={this.state.todoText} />

                    <Dropdown className='assign-dropdown'>
                        <Dropdown.Toggle id='team-selector'>
                            {
                                // decide if the user is on a team or if the user hasn't selected a team yet
                                this.state.assignee.length > 0 ? this.state.assignee : "None"
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.setState({assignee: ''})}>
                                None
                            </Dropdown.Item>
                            {memberDropdownItems}
                        </Dropdown.Menu>
                    </Dropdown>
                </form>
                <button className='submit-btn btn' onClick={this.onSubmitTodo}>Submit</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
})

export default connect(mapStateToProps, {addTodoToTeam})(AddTodo);