import React from 'react';

const Message = ({msg, userName}) => {
    let isSentByCurrUser = false;
    const trimmedName = userName.trim().toLowerCase();
    if (msg.user === trimmedName) isSentByCurrUser = true;

    return(
        <div>
            <p>{msg.user}: {msg.text}</p>
        </div>
    )
}

export default Message;