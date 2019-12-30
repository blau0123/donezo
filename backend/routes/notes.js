/*
Contains the API endpoints for notes
Endpoints: get all notes, add a note, get a single note
*/

const router = require('express').Router();
let Note = require('../models/note.model');

/*
@route GET /notes/
@desc Gets all notes
@access Public
*/
router.route('/').get((req, res) => {
    Note.find()
        .then(notes => res.json(notes))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
@route GET /notes/add
@desc Adds a note
@access Public
*/
router.route('/add').post((req, res) => {
    const noteData = req.body.noteData;

    const newNote = new Note({
        noteTitle: noteData.noteTitle,
        noteBody: noteData.noteBody,
        author: noteData.author,
        pinned: noteData.pinned,
    })

    // add the new note to the db
    newNote.save()
        .then(() => res.json(newNote))
        .catch(err => res.status(400).json('Error: ' + err))
})

/*
@route GET /notes/:id
@desc Gets a specific note with an id
@access Public
*/
router.route('/:id').get((req, res) => {
    Note.findById(req.params.id)
        .then(note => res.json(note))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
@route POST /notes/update
@desc Updates a given note
@access Public
*/
router.route('/update').post((req, res) => {
    const noteTitle = req.body.noteData.noteTitle;
    const noteBody = req.body.noteData.noteBody;
    const noteId = req.body.noteData.noteId;
    const pinned = req.body.noteData.pinned;

    Note.findById(noteId)
        .then(note => {
            // update note with given data
            note.noteTitle = noteTitle;
            note.noteBody = noteBody;
            note.pinned = pinned;
            
            // save new updates to the note
            note.save()
                .then(note => res.json(note))
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

/*
@route POST /notes/delete
@desc Deletes a given note
@access Public
*/
router.route('/delete').post((req, res) => {
    const noteId = req.body.noteData._id;
    // delete note by id from db
    Note.deleteOne({_id: noteId}, (err) => {
        if (err) return res.status(400).json('Error: ' + err);
        console.log('Delete successful');
    })
})

module.exports = router;