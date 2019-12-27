import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import { connect } from 'react-redux';
import {addChatMsg, getChatHistory} from '../../redux/actions/teamActions';
import Grid from '@material-ui/core/Grid';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css';

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

    return (
        <div>
            <h1>{team.teamName} Chat</h1>
            <button onClick={() => props.history.goBack()}>Back to team</button>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <ScrollToBottom>
                    <Messages msgs={messages} userName={userName} team={team}/>
                    </ScrollToBottom>
                    <input className='send-msg' value={message} onChange={evt => setMessage(evt.target.value)} 
                        onKeyPress={evt => {
                            return evt.key === 'Enter' ? sendMessage(evt) : null
                        }}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <h3>Team members</h3>
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
    team: state.team,
});

export default connect(mapStateToProps, {addChatMsg, getChatHistory})(Chat);