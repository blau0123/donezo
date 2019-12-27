import React, {useEffect} from 'react';
import ScrollToBottom, {useScrollToBottom, useSticky} from 'react-scroll-to-bottom';
import Message from './Message';
import {animateScroll} from 'react-scroll';


const Messages = ({msgs, userName}) => {

    useEffect(() => {
    })
    
    return(
        <ScrollToBottom scrollViewClassName='msgsContainer'>
            <div className='msgsContainer' style={{height:'80vh', overflow:'auto'}} >
                { 
                    msgs ? msgs.map((msg, i) =>
                        <div key={i}>
                            <Message msg={msg} userName={userName} />
                        </div> 
                    ) : null
                }
            </div>
        </ScrollToBottom>
    )
}

export default Messages;