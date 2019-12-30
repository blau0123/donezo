/*
Contains the API endpoints for events
*/
const router = require('express').Router();
let Event = require('../models/event.model');

/*
@route POST /events/add
@desc Adds an event
@access Public
*/
router.route('/add').post((req, res) => {
    const eventData = req.body.eventData;

    const newEvent = new Event({
        eventTitle: eventData.eventTitle,
        eventDescription: eventData.eventDescription,
        eventLocation: eventData.eventLocation,
        eventStartTime: eventData.eventStartTime,
        eventEndTime: eventData.eventEndTime,
    })

    // add the new note to the db
    newEvent.save()
        .then(() => res.json(newEvent))
        .catch(err => res.status(400).json('Error: ' + err))
})

/*
@route POST /events/delete
@desc Deletes an event
@access Public
*/
router.route('/delete').post((req, res) => {
    const eventId = req.body.eventData._id;
    // delete event by id from db
    Event.deleteOne({_id: eventId}, (err) => {
        if (err) return res.status(400).json('Error: ' + err);
        console.log('Delete successful');
    })
})

/*
@route POST /events/update
@desc Updates an event
@access Public
*/
router.route('/update').post((req, res) => {
    //const eventId = req.params.id;
    const newEventData = req.body.eventData;
    const eventId = newEventData.eventId;

    // find the event and update with the new info
    Event.findById(eventId)
        .then(event => {
            event.eventTitle = newEventData.eventTitle;
            event.eventLocation = newEventData.eventLocation;
            event.eventDescription = newEventData.eventDescription;
            event.eventStartTime = newEventData.eventStartTime;
            event.eventEndTime = newEventData.eventEndTime;

            // save the updated event to db
            event.save()
                .then(() => res.json('updated event'))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
})

module.exports = router;