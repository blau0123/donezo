import React from 'react';
import './css/Message.css';
import {Link, withRouter} from 'react-router-dom';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const onContextItemClick = (evt, data) => {
    console.log(data);
    // convert text to note
    if (data.type === 'note'){
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
    // convert text to todo
    else if (data.type === 'todo'){
        data.history.push({
            pathname:'/addtodo',
            state:{
                todoText: data.msgData.text,
                teamData: data.teamData,
            }
        })
    }
}

const Message = (props) => {
    let isSentByCurrUser = false;
    const trimmedName = props.userName.trim().toLowerCase();
    if (props.msg.user === trimmedName) isSentByCurrUser = true;

    const message = isSentByCurrUser ? 
        <div className='msgContainer justifyEnd'>
            <div className='msgBox currUser'>
                <p className='msgText'>{props.msg.text}</p>
            </div>
        </div> :
        <div className='msgContainer justifyStart notMe'>
            <p>{props.msg.user}</p>
            <div className='msgBox notCurrUser'>
                <p className='msgText'>{props.msg.text}</p>
            </div>
        </div>;

    return(
        <div key={props.msg._id}>
            <ContextMenuTrigger id={props.msg._id}>
                {message}
            </ContextMenuTrigger>

            <ContextMenu id={props.msg._id} className='context-menu-container'>
                <MenuItem className='context-menu-item' id='note'
                    data={{msgData: props.msg, teamData: props.team, history: props.history, type:'note'}} 
                    onClick={onContextItemClick}>
                    Turn to note
                </MenuItem>
                <MenuItem className='context-menu-item' id='todo'
                    data={{msgData: props.msg, teamData: props.team, history: props.history, type:'todo'}} 
                    onClick={onContextItemClick}>
                    Turn to todo
                </MenuItem>
            </ContextMenu>
        </div>
    )
}

export default withRouter(Message);