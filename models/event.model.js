const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventTitle: {
        type: String,
        required: true,
    },
    eventDescription: String,
    eventLocation: String,
    eventStartTime: {
        type: Date,
        required: true,
    },
    author: String,
    eventEndTime: {
        type: Date,
        required: true,
    }
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;