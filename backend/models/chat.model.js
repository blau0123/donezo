const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    message: [{
        author: String,
        text: String,
    }]
}, {
        // automatically adds fields for when created and modified
        timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;