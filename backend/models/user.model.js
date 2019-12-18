const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minLength: 3,
    },
    password: {
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
    email: {
        type: String,
        required: true,
    }
}, {
        // automatically adds fields for when created and modified
        timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;