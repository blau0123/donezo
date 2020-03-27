const express = require('express');
const cors = require('cors');
const path = require("path");
// helps connect to mongodb
const mongoose = require('mongoose');

const http = require('http');
const socketio = require('socket.io');

// passport is middleware for authentication
const passport = require('passport');

const {addUser, removeUser, getUser, getUsersInTeam} = require('./routes/chatUsers');
let Team = require('./models/team.model');

const app = express();
const server = http.createServer(app);

// process.env.PORT is the port that you use if you host your app somewhere, like heroku
const port = process.env.PORT || 5000;
//const server = app.listen(port)

// set express middleware
app.use(cors());
// allow us to parse json because server receive and send json
app.use(express.json());
//set up passport middleware and passport config
app.use(passport.initialize());
require('./config/passport')(passport);

// database uri from mongodb atlas dashboard
//const uri = process.env.ATLAS_URI;
const uri = require('./config/keys.js').ATLAS_URI;

// start connection with mongodb database
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// tell server to use these API router files (able to use API endpoints)
const teamsRouter = require('./routes/teams');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');
const eventsRouter = require('./routes/events');
const tagsRouter = require('./routes/tags');
// when user goes to /teams, server will load everything in teamsRouter
app.use('/teams', teamsRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);
app.use('/events', eventsRouter);
app.use('/tags', tagsRouter);

// serve static files from react frontend app
app.use(express.static(path.join(__dirname, "client", "build")))
//build mode
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})

let numMsgsRead = 5;

// web sockets for chatting
const io = socketio(server);
//const io = require("socket.io").listen(server);
io.on('connection', socket => {
    // each socket instance represents a user
    console.log('new connection');

    // when a user joins a chat
    socket.on('join', ({user, currTeam}, callback) => {
        const teams = connection.db.collection('teams');
    
        teams.find().toArray((err, res) => {    
            console.log(res);
            const desired = res.filter(team => team._id.toHexString() === currTeam._id)[0];
            console.log('sending old msgs...');
            // sends the most recent 5 messages
            //socket.emit('old msgs', desired.teamChat.slice(1).slice(-5));
            socket.emit('old msgs', desired.teamChat);
        })
        
        // add the user to the chat
        const {err, newUser} = addUser(
            {
                userId: user.id, 
                socketId: socket.id,
                name: user.firstName + " " + user.lastName,
                team: currTeam
            }
        );

        // if there was an error getting the user, call the callback
        if (err) return callback(err);
        /* emit welcome message to the user that just joined the chat 
        socket.emit('message', {user:'admin', text:`${newUser.name} welcome to ${newUser.team.teamName}`});
        // tell everyone in chat besides the new user that the new user has joined
        socket.broadcast.to(newUser.team.teamName).emit('message', {user:'admin', text:`${newUser.name} has joined`})
        */
        // let the user join the team chat room
        socket.join(newUser.team.teamName);
        
        callback();
    })

    socket.on('sendMessage', (msg, callback) => {
        // get the user that is sending the message
        const user = getUser(socket.id);
        const chatData = {user:user.name, text:msg};
        // adds the new message to the given team
        Team.findById(user.team._id)
            .then(team => {
                team.teamChat.push(chatData);
                // add message to team and save to db
                team.save()
                    // emit new message after saving the new chat msg
                    .then(() => io.to(user.team.teamName).emit('message', chatData))
                    .catch(err => console.log(err));
            })
        callback();
    })

    /*
    When the user scrolls to the top and needs to load more messages,
    load 5 more messages based on numMsgsRead var
    */
    socket.on('loadMoreMsgs', (currTeam, callback) => {
        const teams = connection.db.collection('teams');
        teams.find().toArray((err, res) => {    
            const desired = res.filter(team => team._id.toHexString() === currTeam._id)[0];
            let nextFive = null;
            // if no more messages left, don't do anything
            if (numMsgsRead >= desired.teamChat.length){
                
            }
            // sends the the next 5 messages (or as many messages left)
            else if (numMsgsRead + 5 >= desired.teamChat.length){
                nextFive = desired.teamChat.slice(numMsgsRead, desired.teamChat.length);
                numMsgsRead += 5;
            }
            else{
                nextFive = desired.teamChat.slice(numMsgsRead, numMsgsRead + 5);
                numMsgsRead += 5;
            }
            console.log('sending next five msgs...')
            callback(nextFive);
        })
    })

    socket.on('disconnect', () => {
        console.log('user has left');
        const user = removeUser(socket.id);
        console.log(numMsgsRead);
        numMsgsRead = 5;
    });
})

// starts the server (listens on certain port)
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
