import React from 'react';
import { connect } from 'react-redux';
import {addTodoToTeam} from '../../redux/actions/teamActions';

class AddTodo extends React.Component{
    constructor(){
        super();
        this.state = {
            todoText: '',
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmitTodo = this.onSubmitTodo.bind(this);
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
            author: user.firstName + ' ' + user.lastName,
        }

        // add todo to team and redirect back to the team home
        this.props.addTodoToTeam(teamData, todoData);
        this.props.history.push(`/team/${teamData._id}`);
    }

    render(){
        return(
            <div className='container'>
                <form onSubmit={this.onSubmitTodo}>
                    <label>What do you what to complete?</label>
                    <input name='todoText' type='text' onChange={this.onChange} value={this.state.todoText} />
                    <input type='submit' value='Submit' />
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps, {addTodoToTeam})(AddTodo);