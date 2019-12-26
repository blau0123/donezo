import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';

const Messages = ({msgs, userName}) => {
    return(
        <ScrollToBottom>
            {msgs.map((msg, i) =>
                <div key={i}>
                    <Message msg={msg} userName={userName} />
                </div>
            )}
        </ScrollToBottom>
    )
}

export default Messages;