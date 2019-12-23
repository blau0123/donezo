const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    noteTitle: {
        type: String,
        required: true,
        trim: true,
    },
    noteBody: {
        type: String,
        required: true,
        trim: true,
    },
    pinned: Boolean,
    author: String
}, {
        // automatically adds fields for when created and modified
        timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;