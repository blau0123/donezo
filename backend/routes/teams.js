/*
Contains the API endpoints for teams
Endpoints: get all teams, add single team
*/

const router = require('express').Router();
let Team = require('../models/team.model');

/*
@route GET /teams/
@desc Gets all teams
@access Public
*/
router.route('/').get((req, res) => {
    // find() is a mongoose method that gets list of all users in mongodb database
    Team.find()
        .populate('teamNotes')
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

    const newTeam = new Team({
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
        .populate('teamNotes')
        .populate('teamEvents')
        .exec((err, team) => {
            if (err) return res.status(400).json(err);

            console.log(team);
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
            team.teamMembers = req.body.teamMembers;
            team.teamNotes = req.body.teamNotes;

            team.save()
                .then(() => res.json('Team updated'))
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
    const userId = req.body.userData.id;
    //const userData = req.body.userData;
    const teamId = req.body.teamData;
    const firstName = req.body.userData.firstName;
    const lastName = req.body.userData.lastName;

    Team.findById(teamId)
        .then(team => {
            // check to make sure that the user isn't already apart of the team (can't add twice)
            let found = false;
            for (let i = 0; i < team.teamMembers.length; i++){
                if (userId === team.teamMembers[i].userId){
                    found = true;
                    break;
                }
            }

            // if user is not in list, then add them to team
            if (!found){
                team.teamMembers.push({userId, firstName, lastName});
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

module.exports = router;