import React from 'react';
import './Message.css';
import {Link, withRouter} from 'react-router-dom';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const onContextItemClick = (evt, data) => {
    // push the user to add note page with msg data
    const currNote = {
        noteTitle: '',
        noteBody: data.msgData.text,
    }

    data.history.push({
        pathname:`/noteslist/${data.teamData._id}`,
        state:{
            currNote,
            teamData: data.teamData,
            fromChat: true,
        }
    })
}

const Message = (props) => {
    let isSentByCurrUser = false;
    const trimmedName = props.userName.trim().toLowerCase();
    if (props.msg.user === trimmedName) isSentByCurrUser = true;

    const message = isSentByCurrUser ? 
        <div className='msgContainer justifyEnd'>
            <div className='msgBox currUser'>
                <p className='msgText'>{props.msg.text}</p>
                <Link to={{pathname:'/addnote',
                    state:{title:'', body:props.msg.text, teamData:props.team}}}>+</Link>
            </div>
        </div> :
        <div className='msgContainer justifyStart notMe'>
            <p>{props.msg.user}</p>
            <div className='msgBox notCurrUser'>
                <p className='msgText'>{props.msg.text}</p>
                <Link to={{pathname:'/addnote',
                    state:{title:'', body:props.msg.text, teamData:props.team}}}>+</Link>
            </div>
        </div>;

    return(
        <div key={props.msg._id}>
            <ContextMenuTrigger id={props.msg._id}>
                {message}
            </ContextMenuTrigger>

            <ContextMenu id={props.msg._id} className='context-menu-container'>
                <MenuItem className='context-menu-item' 
                    data={{msgData: props.msg, teamData: props.team, history: props.history}} 
                    onClick={onContextItemClick}>
                    Turn to note
                </MenuItem>
            </ContextMenu>
        </div>
    )
}

export default withRouter(Message);