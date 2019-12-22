const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
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
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    }],
    teamNotes: [{
        noteTitle: {
            type: String,
            required: true,
        },
        noteBody: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        }
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
        author: {
            type: String,
            required: true,
        }
    }],
}, {
        // automatically adds fields for when created and modified
        timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;