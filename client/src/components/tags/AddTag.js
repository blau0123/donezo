import React from "react";

const AddTag = props => {
    const {tags, addTag, deleteTag, currTeam} = props;

    const tagDropdownItems = currTeam.teamTags && currTeam.teamTags.length > 0 ?
    currTeam.teamTags.map(tag => {
        // return the dropdown item for that specific tag
        return(
           <option value={tag.title} key={tag._id} className="tag-option">{tag.title}</option>
        )
    }) : null;

    return(
        <div className="select-tag-container">
            {
                // show the selected tags
                tags && tags.length > 0 ? tags.map(tag => 
                    <div id={tag._id} key={tag._id} className="tagContainer added-tag" style={{backgroundColor: tag.color}} onClick={deleteTag}>
                        <p id={tag._id}>{tag.title}</p>   
                    </div> ) : null
            }
            <select className="select-tag" id="select-tag">
                {tagDropdownItems}
            </select>
            <button onClick={addTag} className="btn">Add</button>
        </div>
    )
}

export default AddTag;