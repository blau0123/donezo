/*
All of the actions that have to do with authentication, including:
Register user
Log the user in
Log the user out
*/

import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {GET_ERRORS, SET_CURRENT_USER, USER_LOADING} from './types';

// action for registering the user
export const registerUser = (userData, history) => dispatch => {
    axios.post('/users/register', userData)
        .then(res => {
            // successfully registered, so let the user login
            console.log(res);
            history.push("/login");
        })
        .catch(err => {
            dispatch({type: GET_ERRORS, payload: err.response.data});
        })
}

// action for login the user
export const loginUser = userData => dispatch => {
    axios.post('/users/login', userData)
        .then(res => {
            // save users token to local storage and set the current user
            const {token} = res.data;
            localStorage.setItem("jwtToken", token);
            // set token to auth header
            setAuthToken(token);
            const decodedToken = jwt_decode(token);
            dispatch(setCurrentUser(decodedToken));
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            })
        })
}

// set the logged in user
export const setCurrentUser = decodedToken => {
    return {
        type:SET_CURRENT_USER, 
        payload: decodedToken,
    }
}

// set user loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING,
    }
}

// log user out
export const logoutUser = () => dispatch => {
    // remove token from local storage
    localStorage.removeItem("jwtToken");
    // remove auth header for future requests
    setAuthToken(false);
    // set the curr user to {}, which sets isAuthenticated to false
    dispatch(setCurrentUser({}));
}