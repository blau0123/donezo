import React from 'react';
// dependencies for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {updateEvent} from '../../redux/actions/eventActions';
import { connect } from 'react-redux';

import './AddEvent.css';

class EditEvent extends React.Component{
    constructor(){
        super();
        this.state = {
            title: '',
            description: '',
            location: '',
            startTime: new Date(),
            endTime: new Date(),
        }

        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        // get the info from the event that was clicked on
        const {event} = this.props.location.state;
        console.log(event);
        if (event){
            this.setState({
                title: event.eventTitle,
                description: event.eventDescription,
                location: event.eventLocation,
                startTime: new Date(event.eventStartTime),
                endTime: new Date(event.eventEndTime),
            })
        }
    }

    handleStartDateChange(date){
        // set the end time as an hour after the start time
        const newEnd = new Date(date);
        newEnd.setHours(newEnd.getHours() + 1);
        this.setState({
            endTime: new Date(newEnd)
        })

        this.setState({
            startTime: new Date(+date),
        })
    }

    handleEndDateChange(date){
        this.setState({
            endTime: new Date(+date),
        })
    }

    onChange(evt){
        const id = evt.target.id;
        this.setState({[id]: evt.target.value});
    }

    onSubmit(evt){
        evt.preventDefault();
        const {user} = this.props.auth;
        // get team data passed in by state from team.js
        const {teamData} = this.props.location.state;

        if (this.state.startTime > this.state.endTime){
            alert('Your start time must be earlier than your end time');
            return;
        }

        const eventToUpdate = {
            eventId: this.props.location.state.event._id,
            eventTitle: this.state.title,
            eventDescription: this.state.description,
            eventLocation: this.state.location,
            eventStartTime: this.state.startTime,
            eventEndTime: this.state.endTime,
            author: user.firstName + ' ' + user.lastName,
        }

        this.props.updateEvent(eventToUpdate);
        //this.props.history.push(`/team/${teamData._id}`);
        this.props.history.goBack();
    }

    render(){
        return(
            <div className='add-event-container'>
                <h1 className='add-event-header'>What would you like to change?</h1>
                <form className='add-event-form'>
                    <label className='input-label'>What's the name of your event?</label>
                    <input className='event-input' id='title' type='text' value={this.state.title} 
                        onChange={this.onChange} />
                    <label className='input-label'>Describe your event.</label>
                    <textarea className='event-input' id='description' type='text' 
                        value={this.state.description} rows='5'
                        onChange={this.onChange} />
                    <label className='input-label'>Where will your event be?</label>
                    <input className='event-input' id='location' type='text' value={this.state.location} 
                        onChange={this.onChange} />
                    <div className='date-selectors'>
                        <MuiPickersUtilsProvider
                            className='date-picker'
                            utils={DateFnsUtils}>
                            <div className='date-chooser'>
                                <DateTimePicker
                                    className='date-chooser'
                                    id='startTime'
                                    label='Choose a start time'
                                    value={this.state.startTime}
                                    onChange={this.handleStartDateChange}/>
                            </div>
                            <div className='date-chooser'>
                                <DateTimePicker
                                    className='date-chooser'
                                    id='endTime'
                                    label='Choose an end time'
                                    value={this.state.endTime}
                                    onChange={this.handleEndDateChange}/>
                            </div>
                        </MuiPickersUtilsProvider>
                    </div>
                    <button onClick={this.onSubmit} className='submit-btn btn'>Submit</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state =>({
    auth: state.auth,
    event: state.event,
})

export default connect(mapStateToProps, {updateEvent})(EditEvent);