/*
Contains the API endpoints for users
Endpoints: get all users, add single user
*/

const router = require('express').Router();
let User = require('../models/user.model');
// used for authorization
const jwt = require('jsonwebtoken');
// used for hashing the user's password before storing for security
const bcrypt = require('bcryptjs');
const keys = require('../config/devKeys');

/*
handles incoming http get requests on /users/ URL path
*/
router.route('/').get((req, res) => {
    // find() is a mongoose method that gets list of all users in mongodb database
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
handles incoming http post requests on /users/register URL path
*/
router.route('/register').post((req, res) => {
    // get inputted username from request's body
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // check to make sure username doesn't already exist in db
    User.find({"email": email})
        .then(user => {
            // if user already has that username, don't allow the user to create
            if (user.length > 0){
                res.status(400).json("User with that email already exists");
            }
            else{
                const newUser = new User({
                    username,
                    password,
                    firstName,
                    lastName,
                    email,
                });
            
                // encrypt the password then store the user with the encrypted password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.log(err);
                        newUser.password = hash;
                        // save new user to database
                        newUser.save()
                        .then(() => res.json("User registered!"))
                        .catch(err => res.status(400).json('Error: ' + err));
                    })
                })
            }
        })
});

/*
handles authenticating users at login given username and password at /users/login
*/
router.route('/login').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // find the user with the given username
    User.findOne({"username": username})
        .then(user => {
            // if user doesn't exist, then return 404
            if (!user) return res.status(404).json("user does not exist");
            // check if user entered correct password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch){
                        // user matched, so log the user in
                        const jwt_payload = {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                        }

                        // create a signin token
                        jwt.sign(
                            jwt_payload,
                            keys.secretOrKey,
                            {
                                // the user's signin token will expire in 1 year
                                expiresIn:31556926
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token,
                                });
                            }
                        );
                    }
                    else{
                        return res.status(400).json("password is incorrect");
                    }
                })
        })
})

/*
handles get request to get a single user with id
*/
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            res.json(user)
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;