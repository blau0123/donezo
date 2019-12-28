import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message';

// socket stuff
import io from 'socket.io-client';

class Messages extends React.Component{
    constructor(){
        super();
        this.state = {
            msgs: [],
            currTeam: {},
        }
        this.onScroll = this.onScroll.bind(this);
        this.ENDPOINT = 'localhost:5000';
        this.socket = io('localhost:5000');
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.msgs !== prevState.msgs){
            return {msgs: nextProps.msgs, currTeam: nextProps.team}
        }
        else return null;
    }

    /*
    lifecycle method called before an update to check for the user's position in
    the chat. if the user has scrolled high enough, don't bring user down to 
    bottom when there's a new message
    */
    getSnapshotBeforeUpdate(){
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight;
        return null;
    }

    componentDidUpdate(){
        // when there's a new message, bring user to the bottom of the chat
        if (this.shouldScrollToBottom){
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }

    onScroll = () => {
        //get the ref 'containerRef' from this
        const {refs} = this;
        const scrollTop = refs.containerRef.scrollTop;

        // reached the top of the messages, so get more messages
        if (scrollTop === 0){
            console.log('load more messages')
            
            this.socket.emit('loadMoreMsgs', this.state.currTeam, (newMsgs) => {
                if (newMsgs){
                    this.setState((prevState, props) => ({msgs: newMsgs.concat(prevState.msgs)}))
                    /* PROBLEM: WON'T SET STATE TO COMBINED OLD + NEW 5 MESSAGES */
                }
            });    
        }
    }

    render(){
        const {userName, team} = this.props;
        console.log(this.state.msgs);
        return(
            <div ref='containerRef' id='msgsContainer' onScroll={this.onScroll} style={{height:'70vh', overflow:'auto'}} >
                { 
                    this.state.msgs ? this.state.msgs.map((msg, i) =>
                        <div key={i}>
                            <Message msg={msg} userName={userName} team={team}/>
                        </div> 
                    ) : null
                }
            </div>
        )
    }
}

export default Messages;