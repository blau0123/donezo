const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todoText: {
        type: String,
        required: true,
        trim: true,
    },
    author: String
}, {
        // automatically adds fields for when created and modified
        timestamps: true,
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;