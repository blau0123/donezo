const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
})

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;