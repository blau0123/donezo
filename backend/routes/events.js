/*
Contains the API endpoints for events
*/
const router = require('express').Router();
let Event = require('../models/event.model');

/*
@route GET /events/add
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

module.exports = router;