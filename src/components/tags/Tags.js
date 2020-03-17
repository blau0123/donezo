import React from 'react';

import { connect } from 'react-redux';
import {addTag} from '../../redux/actions/tagActions';
import {getTeamWithId} from "../../redux/actions/teamActions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import './css/Tags.css';

class Tags extends React.Component{
    constructor(){
        super();

        this.state = {
            tags: [],
            tag: '',
            tagDesc: '',
            // list of colors that will be chosen randomly
            tagColors: ['#eea990', '#f6e0b5', '#aa6f73', '#0D97AC', '#588C73', '#F2AE72', '#8C4646', '#53BBF4', '#92B06A', '#E19D29']
        }
    }

    componentDidMount(){
        // get the id of the team and call the action to get the specific team
       // const {id} = this.props.match.params;
        const id = this.props.location.state.currTeam._id;
        console.log(id);
        // get the team that the user is viewing and put it into this.props.team
        this.props.getTeamWithId(id);
    }

    componentDidUpdate(prevProps){
        // if added a note, then should refresh to show new note
        if (this.props.tags.tags != prevProps.tags.tags){
            window.location.reload();
        }
    }

    addTagClick = evt => {
        evt.preventDefault();
        const tagData = {
            title: this.state.tag, 
            description: this.state.tagDesc,
            color: this.state.tagColors[Math.floor(Math.random() * this.state.tagColors.length)],
        };

        // clear new tag textbox for if user wants to enter new tag
        this.setState(state => {
            // add newly typed tag to tag list
            const tags = state.tags.concat({title: state.tag, description: state.tagDesc});
            return {tags, tag:'', tagDesc:''}
        });

        const teamId = this.props.location.state.currTeam._id;
        console.log(tagData);
        // add new tag to the db
        this.props.addTag(teamId, tagData);
    }

    onChange = evt => {
        this.setState({[evt.target.id] : evt.target.value});
    }

    render(){
        // get the current team that was passed in
        //const {currTeam} = this.props.location.state;
        const {currTeam} = this.props.team;
        const tags = currTeam.teamTags;
        return(
            <div className="tag-page-container">
                <div className="tag-header-container">
                    <ArrowBackIosIcon fontSize='large' className='back-btn' 
                                onClick={() => this.props.history.push(`/team/${currTeam._id}`)} />
                    <h1 className="tag-header">Tags</h1>
                </div>
                <div className="tag-list">
                {
                    tags && tags.length > 0 ? tags.map(tag =>
                        <div className="tagContainer" style={{backgroundColor: tag.color}}>
                            <p key={tag.title}>{tag.title}</p>   
                        </div> 
                    ) : <p>No tags yet!</p>
                }
                </div>
                <div className="tag-input-container">
                    <label className="input-label">What tag do you want to create?</label>
                    <input type="text" className="tag-input" id="tag" value={this.state.tag} onChange={this.onChange}/>
                    <label className="input-label">Describe your tag.</label>
                    <input type="text" className="tag-input" id="tagDesc" value={this.state.tagDesc} onChange={this.onChange} />
                    <button className="btn add-tag-btn" onClick={this.addTagClick}>Add Tag</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
    tags: state.tags
})

export default connect(mapStateToProps, {addTag, getTeamWithId})(Tags);