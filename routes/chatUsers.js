
// holds all users currently in chat
let users = [];

/*
Add user to the chat room
*/
const addUser = ({userId, socketId, name, team}) => {
    name = name.trim().toLowerCase();
    //teamName = team.teamName;

    // make sure there is no existing user in the chat currently
    const existingUser = users.find((user) => user.team === team && user.name === name);
    if (existingUser) return {err: 'User is already in the room'};

    const newUser = {userId, socketId, name, team};
    users.push(newUser);
    //console.log(newUser);
    return {newUser};
}

/*
Remove a user when they leave the chat
*/
const removeUser = (userId) => {
    // find index of user with the given id
    const indx = users.findIndex((user) => user.userId === userId);
    if (indx !== -1) return users.splice(indx, 1)[0];
}

/*
Get a specific user if they are currently in the chat
*/
const getUser = (socketId) => users.find((user) => user.socketId === socketId);

/*
Get all users in a chat that are apart of a team (in the same chat)
*/
const getUsersInTeam = (team) => users.filter((user) => user.team.teamName === team.teamName);

module.exports = {addUser, removeUser, getUser, getUsersInTeam};