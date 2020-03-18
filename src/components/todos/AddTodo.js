import React from 'react';
import { connect } from 'react-redux';
import {addTodoToTeam} from '../../redux/actions/teamActions';
import Dropdown from 'react-bootstrap/Dropdown';

import './css/AddTodo.css';

class AddTodo extends React.Component{
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

    onSubmitTodo(evt){
        evt.preventDefault();

        const {teamData} = this.props.location.state;
        const {user} = this.props.auth;
        const todoData = {
            todoText: this.state.todoText,
            isCompleted: false,
            assignee: this.state.assignee,
            tags: this.state.tags,
            author: user.firstName + ' ' + user.lastName,
        }

        // add todo to team and redirect back to the team home
        this.props.addTodoToTeam(teamData, todoData);
        this.props.history.goBack();
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

    render(){
        // get current team
        const {teamData} = this.props.location.state;
        const membersList = teamData.teamMembers;
        const {tags} = this.state;
        console.log(teamData);

        // dropdown of all members in curr team to choose an assignee
        const memberDropdownItems = membersList && membersList.length > 0 ?
            membersList.map(member => 
                <Dropdown.Item key={member._id}
                    onClick={() => this.setState({assignee: `${member.user.firstName} ${member.user.lastName}`})}>
                    {member.user.firstName + ' ' + member.user.lastName}
                </Dropdown.Item> 
            ) : null;

        const tagDropdownItems = teamData.teamTags && teamData.teamTags.length > 0 ?
            teamData.teamTags.map(tag => {
                // return the dropdown item for that specific tag
                return(
                   <option value={tag.title} key={tag._id} className="tag-option">{tag.title}</option>
                )
            }) : null;

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