/*
Used to set and delete the Authorization token for axios requests 
depending on if a user is logged in or not
*/

import axios from 'axios';

const setAuthToken = token => {
    if (token){
        // apply auth token to all request if logged in
        axios.defaults.headers.common["Authorization"] = token;
    }
    else{
        // delete auth header
        delete axios.defaults.headers.common["Authorization"];
    }
}

export default setAuthToken;