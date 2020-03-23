/*
module.exports = {
    ATLAS_URI: process.env.ATLAS_URI,
    secretOrKey: "secret",
}
*/
// determine whether to export the production or dev keys
if (process.env.NODE_ENV === "production") module.exports = require("./prod");
else module.exports = require("./devKeys");