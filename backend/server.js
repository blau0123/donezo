const express = require('express');
const cors = require('cors');
// helps connect to mongodb
const mongoose = require('mongoose');

// passport is middleware for authentication
const passport = require('passport');

// .env file loads environment variables from a file
//require('dotenv').config();

const app = express();
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
// when user goes to /teams, server will load everything in teamsRouter
app.use('/teams', teamsRouter);
app.use('/users', usersRouter);

// starts the server (listens on certain port)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})