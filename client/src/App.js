import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/home/Home';
import NotesList from './components/notes/NotesList';
import AllNotes from "./components/notes/AllNotes";
import TagNoteList from "./components/notes/TagNoteList";
import Note from './components/notes/NoteView';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateTeam from './components/teams/CreateTeam';
import TeamSearch from './components/teams/TeamSearch';
import EditTeam from './components/teams/EditTeam';
import Team from './components/teams/Team';
import AddTodo from './components/todos/AddTodo';
import AddEvent from './components/events/AddEvent';
import PrivateRoute from './components/private-route/PrivateRoute';
import EventList from './components/events/EventList';
import EditEvent from './components/events/EditEvent';
import EditTodo from './components/todos/EditTodo';
import Messages from './components/chat/Messages';
import Chat from './components/chat/Chat';
import Message from './components/chat/Message';
import Tags from './components/tags/Tags';

// use the follow in order to track if user is logged in still after reloads
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './redux/actions/authActions';

// redux stuff
import {Provider} from 'react-redux';
import store from './redux/store';

// check for token to keep user logged in
if (localStorage.jwtToken){
  // set auth token header since the user is logged in already
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // decode token to get user info and exp (expiration time)
  const decodedToken = jwt_decode(token);
  // set isAuth for user to be authenticated
  store.dispatch(setCurrentUser(decodedToken));

  // log out the user if the token has expired
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime){
    store.dispatch(logoutUser());
    // redirect to login after log the user out
    window.location.href = './login';
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <PrivateRoute exact path="/" component = {Home} />
        <PrivateRoute exact path="/noteslist/:id" component = {NotesList} />
        <PrivateRoute exact path="/team/:id" component = {Team} />
        <PrivateRoute path="/editteam" component={EditTeam} />
        <PrivateRoute path="/teamsearch" component = {TeamSearch} />

        <PrivateRoute exact path="/team/:teamid/notes/tag/:tagid/:noteid" component = {Note} />
        <PrivateRoute exact path="/team/:teamid/notes/:noteid" component = {Note} />
        <PrivateRoute exact path="/team/:teamid/notes/tag/:tagid" component={TagNoteList} />
        <PrivateRoute exact path="/team/:teamid/notes" component={AllNotes} />

        <PrivateRoute path="/eventslist/:id" component = {EventList} />
        <Route exact path="/login" component = {Login} />
        <Route exact path="/register" component = {Register} />
        <PrivateRoute path="/edittodo" component = {EditTodo} />
        <PrivateRoute path="/addtodo" component = {AddTodo} />
        <PrivateRoute path="/addevent" component = {AddEvent} />
        <PrivateRoute path='/chat' component={Chat} />
        <PrivateRoute path='/messages' component={Messages} />
        <PrivateRoute path='/message' component={Message} />
        <PrivateRoute path='/editevent' component={EditEvent} />
        <PrivateRoute exact path="/createTeam" component = {CreateTeam} />
        <PrivateRoute path="/tags" component={Tags} />
      </Router>
    </Provider>
  );
}

export default App;
