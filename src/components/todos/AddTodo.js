import React from 'react';

class AddTodo extends React.Component{
    constructor(){
        super();
        this.state = {
            todoText: '',
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmitTodo = this.onSubmitTodo.bind(this);
    }

    onChange(evt){
        this.setState({todoText: evt.target.value});
    }

    onSubmitTodo(evt){
        evt.preventDefault();
    }

    render(){
        return(
            <div className='container'>
                <form onSubmit={this.onSubmitTodo}>
                    <label>What do you what to complete?</label>
                    <input name='todoText' type='text' onChange={this.onChange} value={this.state.todoText} />
                    <input type='submit' value='Submit' />
                </form>
            </div>
        )
    }
}

export default AddTodo;