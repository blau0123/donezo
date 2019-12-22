import React from 'react';
// dependencies for date pickers
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {addEventToTeam} from '../../redux/actions/teamActions';
import { connect } from 'react-redux';

class addEvent extends React.Component{
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

        const newEvent = {
            eventTitle: this.state.title,
            eventDescription: this.state.description,
            eventLocation: this.state.location,
            eventStartTime: this.state.startTime,
            eventEndTime: this.state.endTime,
            author: user.firstName + ' ' + user.lastName,
        }

        this.props.addEventToTeam(teamData, newEvent);
        this.props.history.push(`/team/${teamData._id}`);
    }

    render(){
        return(
            <div className='container'>
                <form onSubmit={this.onSubmit}>
                    <label>What's the name of your event?</label>
                    <input id='title' type='text' value={this.state.title} onChange={this.onChange} />
                    <label>Describe your event.</label>
                    <input id='description' type='text' value={this.state.description} onChange={this.onChange} />
                    <label>Where will your event be?</label>
                    <input id='location' type='text' value={this.state.location} onChange={this.onChange} />
                    <MuiPickersUtilsProvider
                        className='date-picker'
                        utils={DateFnsUtils}>
                        <DateTimePicker
                            id='startTime'
                            label='Choose a start time'
                            value={this.state.startTime}
                            onChange={this.handleStartDateChange}/>
                        <DateTimePicker
                            id='endTime'
                            label='Choose an end time'
                            value={this.state.endTime}
                            onChange={this.handleEndDateChange}/>
                    </MuiPickersUtilsProvider>
                    <input type='submit' value='Submit' />
                </form>
            </div>
        )
    }
}

const mapStateToProps = state =>({
    auth: state.auth,
})

export default connect(mapStateToProps, {addEventToTeam})(addEvent);