import React from 'react';
import './Message.css';
import {Link} from 'react-router-dom';

const Message = ({msg, userName, team}) => {
    let isSentByCurrUser = false;
    const trimmedName = userName.trim().toLowerCase();
    if (msg.user === trimmedName) isSentByCurrUser = true;

    const message = isSentByCurrUser ? 
        <div className='msgContainer justifyEnd'>
            <div className='msgBox currUser'>
                <p className='msgText'>{msg.text}</p>
                <Link to={{pathname:'/addnote',
                    state:{title:'', body:msg.text, teamData:team}}}>+</Link>
            </div>
        </div> :
        <div className='msgContainer justifyStart notMe'>
            <p>{msg.user}</p>
            <div className='msgBox notCurrUser'>
                <p className='msgText'>{msg.text}</p>
                <Link to={{pathname:'/addnote',
                    state:{title:'', body:msg.text, teamData:team}}}>+</Link>
            </div>
        </div>;

    return(
        message
    )
}

export default Message;