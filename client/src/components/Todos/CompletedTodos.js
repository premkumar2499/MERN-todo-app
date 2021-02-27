import React, { useContext, useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/userContext';
import { HOST_URL } from '../../Constants'
import Axios from 'axios';
import Loading from '../Loading/Loading';
import ShowMsg from './ShowMsg';


const CompletedTodos = () =>{
    const {userData} = useContext(UserContext);
    const [error,setError] = useState(undefined);
    const [ loading,setLoading ] = useState(false);
    const [ openModal,setOpenModal ] = useState(false);
    const history = useHistory();
    
    useEffect(()=>{
        const MountCompletedTodo = () =>{
            if(!userData.token){
                history.push('/login');
            }
        }
        MountCompletedTodo();
    },[userData])

    const handleModal = () =>{
        setOpenModal(!openModal);
    }
    const handleDelete = async(todo_id)=>{
        console.log(todo_id);
        setLoading(true);
        const deleteTodoRes = await Axios.delete(`${HOST_URL}/api/auth/delete-todo`,{
            headers : {
                "Authorization" : `Bearer ${userData.token}`
            },
            data : {
                todo_id
            }
        });
        console.log(deleteTodoRes);
        if(deleteTodoRes.data){
            setError(deleteTodoRes.data.msg);
        }
        setOpenModal(true);
        setLoading(false);
    }

    const completedTodos = userData.todos.map((todo) => {
        if(todo.completed){
            return(
                <div className="row border border-secondary mb-2 p-3 fs-3">
                    <div className="container">
                        <div className="row pb-3">
                            <div className="col">
                                {todo.content}
                            </div>
                        </div>
                        <div className="row pb-3">
                            <div className="col">
                                {todo.created_at}
                            </div>
                        </div>
                        <div className="row pb-3">
                            <button className="btn btn-danger" onClick={() => handleDelete(todo.id)}>Remove</button>
                        </div>
                    </div>
                </div>
            )
        }
    })
    return(
        <div className="container">
            { loading ?(
                <Loading/>
            ) : (
                completedTodos
            )}
            { openModal && <ShowMsg error={error} handleClose={handleModal} />}
        </div>
    )
}

export default CompletedTodos;