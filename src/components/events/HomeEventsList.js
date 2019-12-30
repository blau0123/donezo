import React from 'react';
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {Link} from 'react-router-dom';

// for right click context menu to delete
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import './HomeEventsList.css';

class HomeEventsList extends React.Component{
    constructor(){
        super();

        this.onContextItemClick = this.onContextItemClick.bind(this);
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
        const {currTeam} = this.props;

        // get all events for this curr team and make component
        let numPastEvents = 0;
        const sortedEvents = currTeam.teamEvents ? this.sortFutureEvents(currTeam.teamEvents)
                : currTeam.teamEvents;
        const eventsList = sortedEvents && sortedEvents.length > 0 ?
                sortedEvents.map(event => {
                    const start = new Date(event.eventStartTime);
                    const end = new Date(event.eventEndTime);
                    // don't show events that have already passed
                    const currTime = new Date();

                    if (currTime < start){
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
                    else{ 
                        // if a past event, keep count of how many
                        numPastEvents++;
                        return null;
                     }
                }) : <p>No events yet!</p>
        
        return (
            <div className='home-events'>
                <div className='all-events-container'>
                    {eventsList}
                </div>
                <p className='past-events-text'>You have {numPastEvents} past event(s).</p>
            </div>
        );
    }
}

export default HomeEventsList;