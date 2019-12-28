import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import { connect } from 'react-redux';
import {addChatMsg, getChatHistory} from '../../redux/actions/teamActions';
import Grid from '@material-ui/core/Grid';
import './Chat.css';

let socket;

const Chat = (props) => {
    const [userName, setUserName] = useState('');
    const [team, setTeam] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const ENDPOINT = 'localhost:5000';
    const containerRef = useRef(null);

    /*
    handles joining and leaving team chat rooms
    */
    useEffect(() => {
        // get the user that's on the chat and the team that this chat is for
        const {currTeam} = props.location.state;
        const {user} = props.auth;

        socket = io(ENDPOINT);

        setUserName(user.firstName + ' ' + user.lastName);
        setTeam(currTeam);

        // emit a join event to let the user join the team chat
        socket.emit('join', {user, currTeam}, () => console.log('yeet'));

        // get the chat history for this chat (obtained in backend and event is sent to frontend)
        socket.on('old msgs', msgs => {
            setMessages(msgs);
        })

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
    event handler to send messages 
    */
    const sendMessage = (evt) => {
        if (message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    
    const onScroll = () => {
        // when get new messages, append to current list of messages
        const scrollTop = containerRef.scrollTop;
        console.log(containerRef);
        if (team){
            //socket.emit('loadMoreMsgs', team, (newMsgs) => setMessages([...messages, newMsgs]));
        }
    }

    return (
        <div ref={containerRef}>
            <h1>{team.teamName} Chat</h1>
            <button onClick={() => props.history.goBack()}>Back to team</button>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Messages msgs={messages} userName={userName} team={team}/>
                    <input className='send-msg' value={message} onChange={evt => setMessage(evt.target.value)} 
                        onKeyPress={evt => {
                            return evt.key === 'Enter' ? sendMessage(evt) : null
                        }}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <h3>Online Team Members</h3>
                    {
                        // show all team members in this team
                        team.teamMembers ? team.teamMembers.map(member => {
                            const name = member.firstName + ' ' + member.lastName;
                            return name === userName ?
                                <p>{member.firstName} {member.lastName} (You)</p> :
                                <p>{member.firstName} {member.lastName}</p>    
                        }) : null
                    }
                </Grid>
            </Grid>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
});

export default connect(mapStateToProps, {addChatMsg, getChatHistory})(Chat);