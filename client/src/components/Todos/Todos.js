import React,{useContext} from 'react';
import Todo  from './Todo';
import UserContext from '../../context/userContext';
import moment from 'moment'


const Todos = () =>{
    const {userData,setUserData} = useContext(UserContext);
    console.log(userData.todos);
    const todos = userData.todos.map((todo,index)=>{
        if(!todo.completed){
            return(
                <Todo key={index} id={todo.id} content={todo.content} created_at={moment(todo.created_at).format('DD MMM YYYY hh:mm A')}/>
            )
        }
    })
    console.log(todos);
    return  (
        <div className="container mt-3">
            {todos}
        </div>
    );
}

export default Todos