import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {loginUser} from '../../redux/actions/authActions';

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            errors: {},
        }
        
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        // if the user is logged in, redirect to home because they shouldn't be able to login
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.auth.isAuthenticated){
            // send user to dashboard if logged in already
            this.props.history.push('/');
        }

        if (nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    onChange(evt){
        const changed = evt.target.name;
        this.setState({[changed]: evt.target.value})
    }

    onSubmit(evt){
        evt.preventDefault();

        const userData = {
            username: this.state.username,
            password: this.state.password,
        }

        // call the action loginUser to log the user in
        this.props.loginUser(userData);
    }

    render(){
        const {errors} = this.state;
        return(
            <div>
                <form onSubmit={this.onSubmit}>
                    <label>Username</label>
                    <input type='text' name='username' value={this.state.username} onChange={this.onChange}/>
                    <label>Password</label>
                    <input type='password' name='password' value={this.state.password} onChange={this.onChange}/>
                    <span>
                        {errors.password}
                        {errors.passwordincorrect}
                    </span>

                    <input type='submit' value='Login' />
                    <p>Don't have an account? Register <Link to='/register'>here</Link></p>
                </form>
            </div>
        )
    }
}

// puts the state from the store into the props of this component
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(mapStateToProps, {loginUser})(Login);