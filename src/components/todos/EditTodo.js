import React from 'react';
import { connect } from 'react-redux';
import {updateTeamTodo} from '../../redux/actions/teamActions';
import Dropdown from 'react-bootstrap/Dropdown';

class EditTodo extends React.Component{
    constructor(){
        super();
        this.state = {
            todoText: '',
            assignee: '',
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmitTodo = this.onSubmitTodo.bind(this);
    }

    onChange(evt){
        this.setState({todoText: evt.target.value});
    }

    componentDidMount(){
        // set state for the passed in props
        const {currTodo} = this.props.location.state;
        this.setState({
            todoText: currTodo.todoText,
            assignee: currTodo.assignee,
        })
    }

    onSubmitTodo(evt){
        evt.preventDefault();

        const {teamData} = this.props.location.state;
        const {user} = this.props.auth;
        const {currTodo} = this.props.location.state;
        const todoData = {
            todoText: this.state.todoText,
            assignee: this.state.assignee,
            id: currTodo._id,
            author: user.firstName + ' ' + user.lastName,
        }

        // add todo to team and redirect back to the team home
        this.props.updateTeamTodo(teamData, todoData);
        this.props.history.push(`/team/${teamData._id}`);
    }

    render(){
        // get current team
        const {teamData} = this.props.location.state;
        const membersList = teamData.teamMembers;

        // dropdown of all members in curr team to choose an assignee
        const memberDropdownItems = membersList && membersList.length > 0 ?
            membersList.map(member => 
                <Dropdown.Item onClick={() => this.setState({assignee: `${member.firstName} ${member.lastName}`})}>
                    {member.firstName + ' ' + member.lastName}
                </Dropdown.Item> 
            ) : null;

        return(
            <div className='container'>
                <form onSubmit={this.onSubmitTodo}>
                    <label>What do you what to complete?</label>
                    <input name='todoText' type='text' onChange={this.onChange} value={this.state.todoText} />
                    <input type='submit' value='Submit' />
                    <Dropdown>
                        <Dropdown.Toggle variant='success' id='team-selector'>
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
})

export default connect(mapStateToProps, {updateTeamTodo})(EditTodo);