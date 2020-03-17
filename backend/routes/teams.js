/*
Contains the API endpoints for teams
Endpoints: get all teams, add single team
*/

const router = require('express').Router();
let Team = require('../models/team.model');
const mongoose = require('mongoose');

/*
@route GET /teams/
@desc Gets all teams
@access Public
*/
router.route('/').get((req, res) => {
    // find() is a mongoose method that gets list of all users in mongodb database
    Team.find()
        .populate({
            path: 'teamNotes',
            populate: {path: "tags"}
        })
        .populate('teamEvents')
        .populate('teamTags')
        .populate({path:'teamMembers.user', mode:'User'})
        .exec((err,teams) => {
            if (err) return res.status(400).json(err);
            return res.json(teams)
        })
});

/*
@route POST /teams/add
@desc Adds a new team
@access Public
*/
router.route('/add').post((req, res) => {
    // get inputted username from request's body
    const teamName = req.body.teamName;
    const teamDescription = req.body.teamDescription;
    const teamMembers = req.body.teamMembers;
    const teamNotes = req.body.teamNotes;
    // teammembers will only have founding member, convert id to objectid
    teamMembers[0].user = mongoose.Types.ObjectId(teamMembers[0].user);

    // create random secret num (4 digits)
    const secretNum = (Math.floor(10000 * Math.random()) + 10000).toString().substring(1);
    const newTeam = new Team({
        secretNum,
        teamName,
        teamDescription,
        teamMembers,
        teamNotes,
    });
    
    // save new team to database
    newTeam.save()
        .then(() => res.json("Team added!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
@route GET /teams/:id
@desc Gets a specific team with an id
@access Public
*/
router.route('/:id').get((req, res) => {
    // find the given team, populate teamNotes with notes docs 
    Team.findById(req.params.id)
        .populate({
            path: 'teamNotes',
            populate: {path: "tags"}
        })
        .populate('teamEvents')
        .populate('teamTags')
        .populate({path:'teamMembers.user', mode:'User'})
        .exec((err, team) => {
            if (err) return res.status(400).json(err);

            return res.json(team);
        })
})

/*
@route DELETE /teams/:id
@desc Deletes a given team
@access Public
*/
router.route('/:id').delete((req, res) => {
    Team.findByIdAndDelete(req.params.id)
        .then(() => res.json("Team deleted"))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
@route /teams/update/:id
@desc Updates a given team's information
@access Public
*/
router.route('/update/:id').post((req, res) => {
    // finds current team with current values
    Team.findById(req.params.id)
        .then(team => {
            // update each attribute for the given team with the new values passed in
            team.teamName = req.body.teamName;
            team.teamDescription = req.body.teamDescription;
            team.secretNum = req.body.secretNum;
            team.teamMembers = req.body.teamMembers;

            team.save()
                .then(() => res.json(team))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
@route POST /teams/join
@desc Allows the given user to join a given team
@access Public
*/
router.route('/join').post((req, res) => {
    const userData = req.body.userData;
    const teamId = req.body.teamData;
    let userId = req.body.userData.user;
    userId = mongoose.Types.ObjectId(userId);

    Team.findById(teamId)
        .then(team => {
            // check to make sure that the user isn't already apart of the team (can't add twice)
            let found = false;
            for (let i = 0; i < team.teamMembers.length; i++){
                if (userId === team.teamMembers[i].user._id){
                    found = true;
                    break;
                }
            }

            // if user is not in list, then add them to team
            if (!found){
                team.teamMembers.push(userData);
                team.save()
                    .then(() => res.json('You have been added to the team'))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else{
                return res.json("You're already in this team")
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
@route POST /teams/addnote
@desc Adds a given note object id to notes list
@access Public
*/
router.route('/addnote').post((req, res) => {
    const teamData = req.body.teamData;
    const noteId = req.body.noteId;

    // find the team that the user is on and add the note id to that team
    Team.findById(teamData._id)
        .then(team => {
            team.teamNotes.push(noteId);
            team.save()
                // send the note data to update the lastAddedNote in store
                .then(() => res.json('Added note'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/deletenote
@desc Deletes a given note object id to notes list
@access Public
*/
router.route('/deletenote').post((req, res) => {
    const noteData = req.body.noteData;
    const teamData = req.body.teamData;
    // find the team that this note belongs to
    Team.findById(teamData._id)
        .then(team => {
            // find the note in the array of notes
            const teamNotes = team.teamNotes;
            for (let i = 0; i < teamNotes.length; i++){
                // found the note, so remove it from the array
                if (teamNotes[i]._id.toHexString() === noteData._id){
                    teamNotes.splice(i, 1);
                }
            }

            // save the team with the deleted note
            team.save()
                .then(() => res.json('note deleted'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/addtodo
@desc Adds a new todo
@access Public
*/
router.route('/addtodo').post((req, res) => {
    const todoData = req.body.todoData;
    const teamData = req.body.teamData;
    // find the team that this todo belongs to
    Team.findById(teamData._id)
        .then(team => {
            team.teamTodos.push(todoData);
            // add todo to team and save to db
            team.save()
                .then(() => res.json(todoData))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/completetodo
@desc Completes a team's todo
@access Public
*/
router.route('/completetodo').post((req, res) => {
    const todoData = req.body.todoData;
    const teamData = req.body.teamData;

    // find the team that this todo belongs to
    Team.findById(teamData._id)
        .then(team => {
            // go through array of todos to find the correct id
            for (let i = 0; i < team.teamTodos.length; i++){
                // if found correct todo, change its completed
                if (team.teamTodos[i]._id.toHexString() === todoData.id){
                    team.teamTodos[i].isCompleted = !team.teamTodos[i].isCompleted;
                    break;
                }
            }
            
            // save the updated todo
            team.save()
                .then(() => res.json(todoData))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/deletetodo
@desc Deletes a team's todo
@access Public
*/
router.route('/deletetodo').post((req, res) => {
    const todoData = req.body.todoData;
    const teamData = req.body.teamData;

    // find the team that this todo belongs to
    Team.findById(teamData._id)
        .then(team => {
            // go through array of todos to find the correct id
            for (let i = 0; i < team.teamTodos.length; i++){
                if (team.teamTodos[i]._id.toHexString() === todoData._id){
                    // remove the element at index 1
                    team.teamTodos.splice(i, 1);
                    break;
                }
            }
            console.log(team.teamTodos);
            // save the updated todo
            team.save()
                .then(() => res.json('Deleted todo'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/updatetodo
@desc Updates a given todo
@access Public
*/
router.route('/updatetodo').post((req, res) => {
    const todoData = req.body.todoData;
    const teamData = req.body.teamData;

    // find the team that this todo belongs to
    Team.findById(teamData._id)
        .then(team => {
            // go through array of todos to find the correct id
            for (let i = 0; i < team.teamTodos.length; i++){
                const currTodo = team.teamTodos[i];
                console.log(currTodo._id.toHexString(),todoData.id,todoData._id);
                // if found correct todo, update the todo
                if (currTodo._id.toHexString() === todoData.id){
                    currTodo.todoText = todoData.todoText;
                    currTodo.assignee = todoData.assignee;
                    break;
                }
            }
            
            // save the updated todo
            team.save()
                .then(() => res.json(todoData))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route GET /teams/:id/tags/
@desc get a list of a specific team's tags
*/
router.route('/:id/tags/').get((req, res) => {
    const teamId = req.params.id;
})

/*
@route POST /teams/:id/tags/add
@desc add a tag to a specific team
*/
router.route('/:id/tags/add').post((req, res) => {
    const tagId = req.body.tagId;
    const teamId = req.params.id;

    Team.findById(teamId)
        .then(team => {
            // got the team with the specific id, so add tag
            team.teamTags.push(tagId);
            console.log(tagId);
            
            team.save()
                .then(() => res.json('Tag added to team'))
                .catch(err => res.status(400).json(err));
        })
})

/*
@route POST /teams/addevent
@desc Adds a new event with a title, description, location, and start and end time
@access Public
*/
router.route('/addevent').post((req, res) => {
    const eventId = req.body.eventId;
    const teamData = req.body.teamData;
    
    // find the team that this todo belongs to
    Team.findById(teamData._id)
        .then(team => {
            team.teamEvents.push(eventId);
            // add event to team and save to db
            team.save()
                .then(() => res.json('Event added'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/deleteevent
@desc Deletes event objectid from event list in team
@access Public
*/
router.route('/deleteevent').post((req, res) => {
    const eventData = req.body.eventData;
    const teamData = req.body.teamData;
    // find the team that this note belongs to
    Team.findById(teamData._id)
        .then(team => {
            // find the note in the array of notes
            const teamEvents = team.teamEvents;
            for (let i = 0; i < teamEvents.length; i++){
                // found the note, so remove it from the array
                if (teamEvents[i]._id.toHexString() === eventData._id){
                    teamEvents.splice(i, 1);
                }
            }

            // save the team with the deleted note
            team.save()
                .then(() => res.json('event deleted'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route POST /teams/chat/add
@desc Adds a new chat message
@access Public
*/
router.route('/chat/add').post((req, res) => {
    const chatData = req.body.chatData;
    const teamData = req.body.teamData;

    // find the team that this message is being sent to
    Team.findById(teamData._id)
        .then(team => {
            team.teamChat.push(chatData);
            // add message to team and save to db
            team.save()
                .then(() => res.json(chatData))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
})

/*
@route GET /teams/chat/
@desc Get all messages for a team's chat
@access Public
*/
router.route('/chat/:id').get((req, res) => {
    // find the team that this message is being sent to
    Team.findById(req.params.id)
        .then(team => res.json(team.teamChat))
        .catch(err => res.status(404).json('Error: ' + err));
})

module.exports = router;