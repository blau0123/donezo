import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Link} from 'react-router-dom';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import {getTeamWithId} from '../../redux/actions/teamActions';
import {deleteEvent} from '../../redux/actions/eventActions';
import {connect} from 'react-redux';

import './EventList.css';

class EventList extends React.Component{
    constructor(){
        super();
        this.sortEvents = this.sortEvents.bind(this);
        this.sortFutureEvents = this.sortFutureEvents.bind(this);
        this.onContextItemClick = this.onContextItemClick.bind(this);
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
    onContextItemClick(evt, data){
        evt.preventDefault();
        const {eventData} = data;
        const {currTeam} = this.props.team;
        this.props.deleteEvent(eventData, currTeam);
        // reload page to show deletions
        window.location.reload();
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
                        <div key={event._id}>
                            <ContextMenuTrigger id={event._id}>
                                <Link className='link-to-edit'
                                    to={{pathname:'/editevent', state:{event}}}>
                                    <Card className='event-card'>
                                        <h4 className='event-title color-blue'>{event.eventTitle}</h4>
                                        <p>{event.eventDescription.slice(0, 100)}</p>
                                        <div className='event-details'>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2}>
                                                    <LocationOnIcon className='location-icon color-blue'/>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <p>{event.eventLocation}</p>
                                                </Grid>
                                            </Grid>
                                            <p>Start: {start.toLocaleString()}</p>
                                            <p>End: {end.toLocaleString()}</p>
                                        </div>
                                    </Card>
                                </Link>
                            </ContextMenuTrigger>
                            <ContextMenu id={event._id} className='context-menu-container'>
                                <MenuItem className='context-menu-item' data={{eventData: event}} 
                                    onClick={this.onContextItemClick}>
                                    Delete
                                </MenuItem>
                            </ContextMenu>
                        </div>
                    )
                }
            })
        : null;

        if (numPast === 0){
            pastEventsCompon = <p className='no-event-text'>No past events to show!</p>
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
                        <div key={event._id}>
                            <ContextMenuTrigger id={event._id}>
                                <Link className='link-to-edit'
                                    to={{pathname:'/editevent', state:{event}}}>
                                    <Card className='event-card'>
                                        <h4 className='event-title color-blue'>{event.eventTitle}</h4>
                                        <p>{event.eventDescription.slice(0, 100)}</p>
                                        <div className='event-details'>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2}>
                                                    <LocationOnIcon className='location-icon color-blue'/>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <p>{event.eventLocation}</p>
                                                </Grid>
                                            </Grid>
                                            <p>Start: {start.toLocaleString()}</p>
                                            <p>End: {end.toLocaleString()}</p>
                                        </div>
                                    </Card>
                                </Link>
                            </ContextMenuTrigger>
                            <ContextMenu id={event._id} className='context-menu-container'>
                                <MenuItem className='context-menu-item' data={{eventData: event}} 
                                    onClick={this.onContextItemClick}>
                                    Delete
                                </MenuItem>
                            </ContextMenu>
                        </div>
                    )
                }
            })
        : <p>No upcoming events!</p>;

        if (numFuture === 0){
            futureEventsCompon = <p className='no-event-text'>No upcoming events!</p>
        }

        return(
            <div className='event-list-container'>
                <Grid container spacing={1}>
                    <Grid item xs={1}>
                        <ArrowBackIosIcon className='back-btn' onClick={() => this.props.history.goBack()} />
                    </Grid>
                    <Grid item xs={10}>
                        <h1 className='event-list-header'>Events for {currTeam.teamName}</h1>
                    </Grid>
                </Grid>
                <h1 className='event-list-title'>Upcoming Events</h1>
                <div className='all-events-container'>
                    {futureEventsCompon}
                </div>
                <h1 className='event-list-title'>Past Events</h1>
                <div className='all-events-container'>
                    {pastEventsCompon}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    team: state.team,
    event: state.event,
})

export default connect(mapStateToProps, {getTeamWithId, deleteEvent})(EventList);