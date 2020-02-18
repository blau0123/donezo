import React from 'react';

import { connect } from 'react-redux';
import {addTag} from '../../redux/actions/tagActions';

class Tags extends React.Component{
    constructor(){
        super();

        this.state = {
            tags: [],
            tag: '',
            tagDesc: '',
        }
    }

    addTagClick = evt => {
        evt.preventDefault();
        const tagData = {title: this.state.tag, description: this.state.tagDesc};

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
        //const tags = currTeam.teamTags;
        //const tags = this.props.tags;
        const tags = currTeam.teamTags;
        console.log(currTeam);
        return(
            <div>
                <h1>Tags</h1>
                {
                    tags && tags.length > 0 ? tags.map(tag =>
                        <p key={tag.title}>{tag.title}</p>    
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
    tags: state.tags
})

export default connect(mapStateToProps, {addTag})(Tags);