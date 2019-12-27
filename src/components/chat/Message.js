import React from 'react';
import './Message.css';

const Message = ({msg, userName}) => {
    let isSentByCurrUser = false;
    const trimmedName = userName.trim().toLowerCase();
    if (msg.user === trimmedName) isSentByCurrUser = true;

    const message = isSentByCurrUser ? 
        <div className='msgContainer justifyEnd'>
            <div className='msgBox'>
                <p className='msgText'>{msg.text}</p>
            </div>
        </div> :
        <div className='msgContainer justifyStart notMe'>
            <p>{msg.user}</p>
            <div className='msgBox'>
                <p className='msgText'>{msg.text}</p>
            </div>
        </div>;

    return(
        message
    )
}

export default Message;