import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import {getTeamWithId} from '../../redux/actions/teamActions';
import {deleteEvent} from '../../redux/actions/eventActions';
import {connect} from 'react-redux';

class EventList extends React.Component{
    constructor(){
        super();
        this.sortEvents = this.sortEvents.bind(this);
        this.sortFutureEvents = this.sortFutureEvents.bind(this);
    }

    componentDidMount(){
        // get the current team and store in state
        const {id} = this.props.match.params;
        // get the team that the user is viewing
        this.props.getTeamWithId(id);
    }

    componentDidUpdate(prevProps){
        // if any updates to last changed event, refresh to show updates
        if (this.props.event.lastAddedEvent != prevProps.event.lastAddedEvent){
            window.location.reload();
        }
    }

    /*
    Given list of events, sort them from most recent to oldest
    */
    sortEvents(eventsList){
        eventsList.sort((a, b) => {
            a = new Date(a.eventStartTime);
            b = new Date(b.eventStartTime);
            return a > b ? -1 : a < b ? 1 : 0
        })
        return eventsList;
    }

    sortFutureEvents(eventsList){
        eventsList.sort((a, b) => {
            a = new Date(a.eventStartTime);
            b = new Date(b.eventStartTime);
            return a < b ? -1 : a > b ? 1 : 0
        })
        return eventsList;
    }

    render(){
        const {currTeam} = this.props.team;

        const eventsList = currTeam.teamEvents;
        // sort events by date
        const sortedEvents = eventsList ? this.sortEvents(eventsList) : eventsList;
        const sortedFutureEvents = eventsList ? this.sortFutureEvents(eventsList) : eventsList;
        let numPast = 0;
        let numFuture = 0;
        // make component for past events
        let pastEventsCompon = sortedEvents && sortedEvents.length > 0 ?
            sortedEvents.map(event => {
                const start = new Date(event.eventStartTime);
                const end = new Date(event.eventEndTime);
                const currTime = new Date();

                if (currTime > start){
                    numPast++;
                    return(
                        <Card key={event._id}>
                            <button onClick={() => this.props.deleteEvent(event)}>Delete</button>
                            <h4>{event.eventTitle}</h4>
                            <p>{event.eventDescription}</p>
                            <p>{event.eventLocation}</p>
                            <p>Start: {start.toLocaleString()}</p>
                            <p>End: {end.toLocaleString()}</p>
                        </Card>
                    )
                }
            })
        : null;

        if (numPast === 0){
            pastEventsCompon = <p>No past events to show!</p>
        }

        // make component for future events
        let futureEventsCompon = sortedFutureEvents && sortedFutureEvents.length > 0 ?
            sortedFutureEvents.map(event => {
                const start = new Date(event.eventStartTime);
                const end = new Date(event.eventEndTime);
                // don't show events that have already passed
                const currTime = new Date();

                if (currTime <= start){
                    numFuture++;
                    return(
                        <Card key={event._id}>
                            <button onClick={() => this.props.deleteEvent(event)}>Delete</button>
                            <h4>{event.eventTitle}</h4>
                            <p>{event.eventDescription}</p>
                            <p>{event.eventLocation}</p>
                            <p>Start: {start.toLocaleString()}</p>
                            <p>End: {end.toLocaleString()}</p>
                        </Card>
                    )
                }
            })
        : <p>No upcoming events!</p>;

        if (numFuture === 0){
            futureEventsCompon = <p>No upcoming events!</p>
        }

        return(
            <div>
                <button onClick={() => this.props.history.goBack()}>Back to team</button>
                <h1>Upcoming Events</h1>
                {futureEventsCompon}
                <h1>Past Events</h1>
                {pastEventsCompon}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
    event: state.event,
})

export default connect(mapStateToProps, {getTeamWithId, deleteEvent})(EventList);