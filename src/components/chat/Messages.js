import React, {useEffect} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';
import {animateScroll} from 'react-scroll';


const Messages = ({msgs, userName, team}) => {

    useEffect(() => {
        scroll();
    });

    const scroll = () =>
        animateScroll.scrollToBottom({
            containerId: 'msgsContainer'
        });
    
    
    return(
        <div id='msgsContainer' style={{height:'70vh', overflow:'auto'}} >
            { 
                msgs ? msgs.map((msg, i) =>
                    <div key={i}>
                        <Message msg={msg} userName={userName} team={team}/>
                    </div> 
                ) : null
            }
        </div>
    )
}

export default Messages;