import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import Messages from './Messages';

let socket;

const Chat = (props) => {
    const [userName, setUserName] = useState('');
    const [team, setTeam] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const ENDPOINT = 'localhost:5000';

    /*
    handles joining and leaving team chat rooms
    */
    useEffect(() => {
        // get the user that's on the chat and the team that this chat is for
        const {user, currTeam} = props.location.state;

        socket = io(ENDPOINT);

        setUserName(user.firstName + ' ' + user.lastName);
        setTeam(currTeam);
        // emit a join event to let the user join the team chat
        socket.emit('join', {user, currTeam}, () => console.log('yeet'));
        
        // return is the same as componentdidunmount (to disconnect socket)
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [props.location.state, ENDPOINT])

    /*
    handles sending messages
    */
    useEffect(() => {
        socket.on('message', (msg) => {
            // add new message to the array of messages for the chat
            setMessages([...messages, msg]);
        })
    }, [messages])

    /*
    event handler to send messages when the user hits enter
    */
    const sendMessage = (evt) => {
        if (message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div>
            <Messages msgs={messages} userName={userName}/>
            <input value={message} onChange={evt => setMessage(evt.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
}

export default Chat;