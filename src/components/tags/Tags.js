import React from 'react';

import { connect } from 'react-redux';
import {addTag} from '../../redux/actions/tagActions';

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

        // add new tag to the db
        this.props.addTag(teamId, tagData);
    }

    onChange = evt => {
        this.setState({[evt.target.id] : evt.target.value});
    }

    render(){
        // get the current team that was passed in
        const {currTeam} = this.props.location.state;
        //const {currTeam} = this.props.team;
        const tags = currTeam.teamTags;
        return(
            <div>
                <h1>Tags</h1>
                {
                    tags && tags.length > 0 ? tags.map(tag =>
                        <div className="tagContainer" style={{backgroundColor: tag.color}}>
                            <p key={tag.title}>{tag.title}</p>   
                        </div> 
                    ) : <p>No tags yet!</p>
                }
                <input type="text" id="tag" value={this.state.tag} onChange={this.onChange}/>
                <input type="text" id="tagDesc" value={this.state.tagDesc} onChange={this.onChange} />
                <button onClick={this.addTagClick}>Add Tag</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
    tags: state.tags
})

export default connect(mapStateToProps, {addTag})(Tags);