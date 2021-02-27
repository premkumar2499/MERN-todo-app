import Axios from 'axios';
import React , {useState} from 'react';
import {useHistory} from 'react-router-dom'
import { HOST_URL } from '../../Constants';

import EditTodo from './EditTodo';
import Loading from '../Loading/Loading';
import ShowMsg from './ShowMsg';


const Todo = ({id,content,created_at}) =>{
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(undefined);
    const token = localStorage.getItem('auth-token');

    const [openEditModel,setOpenEditModel] = useState(false);
    const [openDeleteModel,setOpenDeleteModel] = useState(false);
    const [openCompletedModel,setOpenCompletedModel] = useState(false);

    const handleDeleteModal = () =>{
        setOpenDeleteModel(!openDeleteModel);
    }

    const handleCompletedModal = () =>{
        setOpenCompletedModel(!openCompletedModel);
    }

    const handleEdit = ()=> {
        setOpenEditModel(!openEditModel);
    }

    const handleDelete = async(todo_id)=>{
        setLoading(true);
        const deleteTodoRes = await Axios.delete(`${HOST_URL}/api/auth/delete-todo`,{
        headers : {
            "Authorization" : `Bearer ${token}`
          },
        data : {
            todo_id
        }
    });
        console.log(deleteTodoRes);
        if(deleteTodoRes.data){
            setError(deleteTodoRes.data.msg);
        }
        setOpenDeleteModel(true);
        console.log(openDeleteModel);
        setLoading(false);
    }

    const handleComplete = async(id)=>{
        setLoading(true);
        const completedRes = await Axios.put(`${HOST_URL}/api/auth/completed`,
        { id },
        { headers: {"Authorization" : `Bearer ${token}`} }
        );
        console.log(completedRes);
        if(completedRes.data){
            setError(completedRes.data.msg);
        }
        setLoading(false);
        setOpenCompletedModel(true);
    }
    return(
    <div className="row border border-secondary mb-2 p-3 fs-3">
        { loading ? (
            <Loading/>
        ) : (
            <div className="container">
                <div className="row pb-3">
                    <div className="col">
                        {content}
                    </div>
                </div>
                <div className="row pb-3">
                    <div className="col">
                        {created_at}
                    </div>
                </div>
                <div className="row pb-3">
                    <div className="col">
                        <button className="btn btn-primary" onClick={()=>handleEdit()}>Edit</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-danger" onClick={() => handleDelete(id)}>Delete</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-success" onClick={() => handleComplete(id)}>Complete</button>
                    </div>
                </div>
            </div>
        )}
        {openEditModel  && <EditTodo id={id} content={content} handleEdit={handleEdit}/>}
        {openDeleteModel  && <ShowMsg error={error} handleClose={handleDeleteModal}/>}
        {openCompletedModel  && <ShowMsg error={error} handleClose={handleCompletedModal} />}
        </div>
    )
}

export default Todo



