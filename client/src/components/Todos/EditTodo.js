import React, {useState,useContext, useEffect} from 'react';
import Axios from "axios";
import {HOST_URL} from '../../Constants'

import moment from 'moment'
import Loading from '../Loading/Loading';
import ShowMsg from './ShowMsg';

const EditTodo = ({id,content,handleEdit}) => {

    const [editTodo, setEditTodo] = useState(content);
    const [error,setError] = useState(undefined);
    const [loading,setLoading] = useState(false);
    const token = localStorage.getItem('auth-token');
    const [btnState,setBtnState] = useState(false)

    const handleOnChange = (e) => {
        setEditTodo(e.target.value.trim());
    }
  
    const submit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        const now = new Date();
        const editTodoObj = {
            id: id,
            content: editTodo,
            created_at : moment(now).format('DD MMM YYYY hh:mm A'),
        }
        
        const editTodoRes = await Axios.put(
            `${HOST_URL}/api/auth/edit-todo`,
            editTodoObj,
            { headers: {"Authorization" : `Bearer ${token}`} }
          );
          console.log(editTodoRes);
          setError(editTodoRes.data.msg);
        if(!editTodoRes.data.success){
            setEditTodo(content);
        }
        else{
          console.log(editTodoRes.data.todos);
        }
        setLoading(false);
    }

    return (
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 add-todo">
      { loading ? (
        <Loading/>
      ) : (
            <div className="modal-dialog modal-dialog-centered w-100 w-xl-50" role="document">
                      <div className="modal-content">
                          { error ? (
                              <ShowMsg error={error} handleClose={handleEdit} />
                          ) : (
                              <>
                                <div className="modal-header">
                                <div className="container">
                                    <div className="row">
                                    <div className="col-10 font-weight-bold fs-2">
                                        Edit Todo
                                    </div>
                                    <div className="col-1 fs-2 btn" onClick={handleEdit}>X</div>
                                    </div>
                                </div>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={submit}>
                                        {error && <p>{error}</p>}
                                    <div className="form-group " id="formGroup">
                                            <input
                                            id="edit-todo"
                                            type="text"
                                            className="form-control mb-1" 
                                            placeholder="Edit Todo"
                                            value={editTodo}
                                            onChange={(e) => setEditTodo(e.target.value)}
                                            />
                                    </div>
                                    <div className="container">
                                        <div className="row pt-2">
                                            {  (editTodo !== content && editTodo) ?(
                                                <input type="submit" className="p-1 btn btn-primary" value="Edit Todo" />
                                            ):(
                                                <input type="submit" className="p-1 btn btn-primary disabled" value="Edit Todo"/>
                                            )}
                                        </div>
                                    </div>
                                </form>
                                </div>
                        </>
            )}
            </div>
        </div>  
            )}
      </div>
    )
}


export default EditTodo;