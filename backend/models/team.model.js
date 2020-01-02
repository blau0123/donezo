const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    secretNum: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3,
    },
    teamDescription: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        minLength: 10,
    },
    // array of user ID's who are apart of this team
    teamMembers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        isAdmin: Boolean,
    }],
    teamNotes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Note'
    }],
    teamTodos: [{
        todoText: {
            type: String,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            required: true,
        },
        assignee: String,
        author: {
            type: String,
            required: true,
        }
    }],
    teamEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    teamChat:[{
        user: String,
        text: String,
    }]
}, {
        // automatically adds fields for when created and modified
        timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;