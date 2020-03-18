/*
Contains API routes and endpoints for todos
*/

const router = require('express').Router();
let Todo = require('../models/todo.model');

/*
@route /todos/
@desc Gets all todos in the database
@access Public
*/
router.route('/').get((req, res) => {
    Todo.find()
        .then(todos => res.json(todos))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
@route /todos/add
@desc Adds a new todo
@access Public
*/
router.route('/add').post((req, res) => {
    const todoText = req.body.todoText;
    const author = req.body.author;
    const tags = req.body.tags;

    const newTodo = new Todo({
        todoText,
        author,
        tags,
    })

    // save the new todo into the db and send the new todo back
    newTodo.save()
        .then(() => res.json(newTodo))
        .catch(err => res.status(400).json('Error: ' + err))
})