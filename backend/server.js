const express = require('express');
const cors = require('cors');
// helps connect to mongodb
const mongoose = require('mongoose');

const http = require('http');
const socketio = require('socket.io');

// passport is middleware for authentication
const passport = require('passport');

const {addUser, removeUser, getUser, getUsersInTeam} = require('./routes/chatUsers');

const app = express();
const server = http.createServer(app);

// process.env.PORT is the port that you use if you host your app somewhere, like heroku
const port = process.env.PORT || 5000;

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
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// tell server to use these API router files (able to use API endpoints)
const teamsRouter = require('./routes/teams');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');
const eventsRouter = require('./routes/events');
// when user goes to /teams, server will load everything in teamsRouter
app.use('/teams', teamsRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);
app.use('/events', eventsRouter);

// web sockets for chatting
const io = socketio(server);
io.on('connection', socket => {
    // each socket instance represents a user
    console.log('new connection');

    // when a user joins a chat
    socket.on('join', ({user, currTeam}, callback) => {
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
        // emit welcome message to the user that just joined the chat 
        socket.emit('message', {user:'admin', text:`${newUser.name} welcome to ${newUser.team.teamName}`});
        // tell everyone in chat besides the new user that the new user has joined
        socket.broadcast.to(newUser.team.teamName).emit('message', {user:'admin', text:`${newUser.name} has joined`})

        // let the user join the team chat room
        socket.join(newUser.team.teamName);
        callback();
    })

    socket.on('sendMessage', (msg, callback) => {
        // get the user that is sending the message
        const user = getUser(socket.id);
        io.to(user.team.teamName).emit('message', {user:user.name, text:msg});
        callback();
    })

    socket.on('disconnect', () => {
        console.log('user has left')
    });
})

// starts the server (listens on certain port)
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})