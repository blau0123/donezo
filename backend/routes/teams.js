/*
Contains the API endpoints for teams
Endpoints: get all teams, add single team
*/

const router = require('express').Router();
let Team = require('../models/team.model');

/*
handles incoming http get requests on /teams/ URL path
*/
router.route('/').get((req, res) => {
    // find() is a mongoose method that gets list of all users in mongodb database
    Team.find()
        .then(teams => res.json(teams))
        .catch(err => res.status(400).json('Error: ' + err));
});

/* 
handles incoming http post requests on /teams/add URL path
if handling dates: const date = Date.parse(req.body.date);
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
handles get request to get a single team with id
*/
router.route('/:id').get((req, res) => {
    Team.findById(req.params.id)
        .then(team => res.json(team))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
handles delete request to delete a single team with id
*/
router.route('/:id').delete((req, res) => {
    Team.findByIdAndDelete(req.params.id)
        .then(() => res.json("Team deleted"))
        .catch(err => res.status(400).json('Error: ' + err));
})

/*
handles making post http request to update team with id on /teams/update
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
handles post requests to update the members of a given team when user joins
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

router.route('/addnote').post((req, res) => {
    console.log(req.body);
    const teamData = req.body.teamData;
    const noteData = req.body.noteData;

    // find the team that the user is on and add the note to that team
    Team.findById(teamData._id)
        .then(team => {
            team.teamNotes.push(noteData);
            team.save()
                // send the note data to update the lastAddedNote in store
                .then(() => res.json(noteData))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;