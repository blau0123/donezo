/*
Holds production set of keys, the keys are set by Heroku as config vars
*/
module.exports = {
    ATLAS_URI: process.env.ATLAS_URI,
    secretOrKey: "secret"
}