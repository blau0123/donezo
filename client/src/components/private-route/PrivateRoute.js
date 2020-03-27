/*
A route in this application that requires authentication (the component
an instance of PrivateRoute represents is stored in component)
If unauth, then the user will be sent to the login screen
*/

import React, { Component } from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
    
// if the user is auth'd, then show this component and if not, show the login
const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route {...rest}
        render={props => 
            auth.isAuthenticated ? <Component {...props} /> :
                <Redirect to='/login' />} />
);

// puts the state from the store into the props of this component
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute);