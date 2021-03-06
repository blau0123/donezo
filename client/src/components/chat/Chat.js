import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import { connect } from 'react-redux';
import {addChatMsg, getChatHistory} from '../../redux/actions/teamActions';
import Grid from '@material-ui/core/Grid';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import GradeIcon from '@material-ui/icons/Grade';

import './css/Chat.css';

let socket;

const Chat = (props) => {
    const [userName, setUserName] = useState('');
    const [currUserId, setCurrUserId] = useState('');
    const [team, setTeam] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    
    let ENDPOINT = "";
    
    if (process.env.NODE_ENV === "production"){
        ENDPOINT = 'https://timelyy.herokuapp.com/';
    }
    else{
        ENDPOINT = "localhost:5000";
    }
    
    const containerRef = useRef(null);

    /*
    handles joining and leaving team chat rooms
    */
    useEffect(() => {
        // get the user that's on the chat and the team that this chat is for
        //const {currTeam} = props.location.state;
        const {currTeam} = props;
        const {user} = props.auth;

        socket = io(ENDPOINT);

        setUserName(user.firstName + ' ' + user.lastName);
        setCurrUserId(user.id);
        setTeam(currTeam);

        // emit a join event to let the user join the team chat
        socket.emit('join', {user, currTeam}, () => console.log('User joined'));

        // get the chat history for this chat (obtained in backend and event is sent to frontend)
        socket.on('old msgs', msgs => {
            setMessages(msgs);
        })

        // return is the same as componentdidunmount (to disconnect socket)
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [/*props.location.state*/, props, ENDPOINT])

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

    return(
        <div ref={containerRef} className='tot-chat-container'>
            {
                team ? 
                <React.Fragment>
                    {
                        /*
                    <Grid container spacing={2}>
                        <Grid item xs={1}>
                            <ArrowBackIosIcon fontSize='large' className='back-btn' 
                                onClick={() => props.history.goBack()} />
                        </Grid>
                        <Grid item xs={11}>
                            <h1 className='chat-title'>{team.teamName} Chat</h1>
                        </Grid>
                    </Grid>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={9}>
                            <Messages msgs={messages} userName={userName} team={team}/>
                            <input className='send-msg' value={message} onChange={evt => setMessage(evt.target.value)} 
                                onKeyPress={evt => {
                                    return evt.key === 'Enter' ? sendMessage(evt) : null
                                }}
                                placeholder="Start typing here"/>
                        </Grid>
                        
                            
                        <Grid item xs={12} sm={3}>
                            <h3 className='chat-member-list color-blue'>Team Members</h3>
                            {
                                // show all team members in this team
                                team.teamMembers ? team.teamMembers.map(member => {
                                    const name = member.user.firstName + ' ' + member.user.lastName;
                                    // checks if the user in the list is curr user and if the user in the list is admin
                                    return currUserId === member.user._id ?
                                        member.isAdmin ? 
                                            <div className='admin-container'>
                                                <GradeIcon className='admin-icon' fontSize='small' />
                                                <p key={member._id}className='bold'>
                                                    {member.user.firstName} {member.user.lastName} (You)
                                                </p>
                                            </div> :
                                            <p key={member._id}className='bold'>
                                                {member.user.firstName} {member.user.lastName} (You)
                                            </p> 
                                        :  member.isAdmin ? 
                                            <div className='admin-container'>
                                                <GradeIcon className='admin-icon' fontSize='small' />
                                                <p key={member._id}>
                                                    {member.user.firstName} {member.user.lastName} 
                                                </p>
                                            </div> :
                                            <p key={member._id}>
                                                {member.user.firstName} {member.user.lastName}
                                            </p>   
                                }) : null
                            }
                        </Grid>
                    </Grid>
                   */}
                    <div>
                        <Messages msgs={messages} userName={userName} team={team}/>
                        <input className='send-msg' value={message} onChange={evt => setMessage(evt.target.value)} 
                            onKeyPress={evt => {
                                return evt.key === 'Enter' ? sendMessage(evt) : null
                            }}
                            placeholder="Start typing here"/>
                    </div>
                </React.Fragment> : <p>Loading...</p>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
});

export default connect(mapStateToProps, {addChatMsg, getChatHistory})(Chat);