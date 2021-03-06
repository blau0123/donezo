import React from 'react';
import { connect } from 'react-redux';
import {updateTeamTodo} from '../../redux/actions/teamActions';
import Dropdown from 'react-bootstrap/Dropdown';
import AddTag from "../tags/AddTag";

import './css/EditTodo.css';

class EditTodo extends React.Component{
    constructor(){
        super();
        this.state = {
            todoText: '',
            assignee: '',
            tags: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmitTodo = this.onSubmitTodo.bind(this);
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

        // get current team
        const currTeam = this.props.location.state.teamData;
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


    onChange(evt){
        this.setState({todoText: evt.target.value});
    }

    componentDidMount(){
        // set state for the passed in props
        const {currTodo} = this.props.location.state;
        this.setState({
            todoText: currTodo.todoText,
            assignee: currTodo.assignee,
            tags: currTodo.tags,
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
            tags: this.state.tags,
            author: user.firstName + ' ' + user.lastName,
        }

        console.log(todoData);

        // add todo to team and redirect back to the team home
        this.props.updateTeamTodo(teamData, todoData);
        //this.props.history.push(`/team/${teamData._id}`);
        this.props.history.goBack();
    }

    render(){
        // get current team
        const {teamData} = this.props.location.state;
        const {tags} = this.state;
        const membersList = teamData.teamMembers;

        // dropdown of all members in curr team to choose an assignee
        const memberDropdownItems = membersList && membersList.length > 0 ?
            membersList.map(member => 
                <Dropdown.Item key={member._id}
                    onClick={() => this.setState({assignee: `${member.user.firstName} ${member.user.lastName}`})}>
                    {member.user.firstName + ' ' + member.user.lastName}
                </Dropdown.Item> 
            ) : null;

        return(
            <div className='edit-todo-container'>
                <h1 className='edit-todo-title'>What do you want to change?</h1>
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

                    <AddTag tags={tags} addTag={this.addTag} deleteTag={this.deleteTag} currTeam={teamData}/>

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

export default connect(mapStateToProps, {updateTeamTodo})(EditTodo);