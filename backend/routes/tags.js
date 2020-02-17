const router = require('express').Router();
let Tag = require('../models/tag.model');

/*
@route /tags/
@desc get all tags
*/
router.route('/').get((req, res) => {
    Tag.find()
        .then(tags => res.json(tags))
        .catch(err => res.status(400).json(err));
})

/*
@route /tags/add
@desc add a new tag 
*/
router.route('/add').post((req, res) => {
    const newTag = new Tag({
        title:  req.body.tagData.title,
        description: req.body.tagData.description,
    });

    newTag.save()
        .then(() => res.json('Tag added!'))
        .catch(err => res.status(400).json(err));
})

/*
@route /tags/:id
@desc get a specific tag with an id
*/
router.route('/:id').get((req, res) => {
    const tagId = req.params.id;

    Tag.findById(tagId)
        .then(tag => res.json(tag))
        .catch(err => res.status(400).json(err));
})

module.exports = router;