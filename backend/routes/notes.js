/*
Contains the API endpoints for notes
Endpoints: get all notes, add a note, get a single note
*/

const router = require('express').Router();
let Note = require('../models/note.model');

/*
handles getting all notes
*/
router.route('/').get((req, res) => {
    Note.find()
        .then(notes => res.json(notes))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
handles adding a given note
*/
router.route('/add').post((req, res) => {
    // get all of the data passed in from the axios post request
    const noteTitle = req.body.noteTitle;
    const noteBody = req.body.noteBody;
    // author holds the id of the user that submitted this note
    const author = req.body.author;

    const newNote = new Note({
        noteTitle,
        noteBody,
        author,
    })

    // add the new note to the db
    newNote.save()
        .then(() => res.json(newNote))
        .catch(err => res.status(400).json('Error: ' + err))
})

// given an id of a note, get the note and return it
router.route('/:id').get((req, res) => {
    Note.findById(req.params.id)
        .then(note => res.json(note))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;