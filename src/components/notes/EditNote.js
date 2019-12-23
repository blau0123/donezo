import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class EditNote extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: '',
            body: '',
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        // when receive props, set the state to the current note
        if (nextProps.currNote !== this.props.currNote){
            this.setState({
                title: nextProps.currNote.noteTitle,
                body: nextProps.currNote.noteBody,
            })
        }
    }

    onSubmit(evt){
        evt.preventDefault();
        const {teamId} = this.props;
        const noteData = {
            noteTitle: this.state.title,
            noteBody: this.state.body,
        }
        console.log(this.state);
    }

    onChange(evt){
        const name = evt.target.name;
        this.setState({[name]: evt.target.value})
    }

    render(){
        // get what note to render
        const {currNote} = this.props;
        
        return(
            <div>
                <form>
                    <TextField name='title' style={{width:'100%'}} id='standard-uncontrolled' value={this.state.title} 
                        onChange={this.onChange}/>
                    <TextField name='body' style={{width:'100%'}} id='outlined-uncontrolled' multiline
                        value={this.state.body} rows={25} variant='outlined' onChange={this.onChange}/>
                    <Button variant='contained' color='primary' onClick={this.onSubmit}
                        disableElevation>Submit</Button>
                </form>
            </div>
        )
    }
}

export default EditNote;