import React, {useState,useContext, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Axios from "axios";
import {HOST_URL} from '../../Constants'
import UserContext from "../../context/userContext";
import moment from 'moment'
import Loading from '../Loading/Loading';
import ShowMsg from './ShowMsg';

const AddTodo = ({setOpenAddTodo, handleAddTodo,todos}) => {

    const { userData, setUserData } = useContext(UserContext);
    const [newTodo, setNewTodo] = useState(undefined);
    const [btnState,setBtnState] = useState(false);
    const [error,setError] = useState(undefined);
    const [loading,setLoading] = useState(false);
    const token = userData.token;

    const handleOnChange = (e) => {
        setNewTodo(e.target.value);
    }
  
    const submit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        const now = new Date();
        const newTodoObj = {
            id: uuidv4(),
            content: newTodo,
            created_at : moment(now).format('DD MMM YYYY hh:mm A'),
            completed:false
        }
        
        const addTodoRes = await Axios.post(
            `${HOST_URL}/api/auth/add-todo`,
            newTodoObj,
            { headers: {"Authorization" : `Bearer ${token}`} }
          );
        console.log(addTodoRes);
        setError(addTodoRes.data.msg);
        if(!addTodoRes.data.success){
            setNewTodo(undefined)
        }
        // else{
        //   setUserData({
        //     todos : addTodoRes.data.todos
        //   })
        // }
        setLoading(false);
    }

    return (
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 add-todo">
      { loading ? (
        <Loading/>
      ):(
            <div className="modal-dialog modal-dialog-centered w-100 w-xl-50" role="document">
                <div className="modal-content">
                        { error ? (
                          <ShowMsg error={error} handleClose={handleAddTodo}/>
                        ) : (
                          <>
                          <div className="modal-header">
                            <div className="container">
                                <div className="row">
                                  <div className="col-10 font-weight-bold fs-2">
                                    Add Todo
                                  </div>
                                  <div className="col-1 fs-2 btn" onClick={handleAddTodo}>X</div>
                                </div>
                              </div>
                          </div>
                          <div className="modal-body">
                              <form onSubmit={submit}>
                                  {error && <p>{error}</p>}
                                <div className="form-group " id="formGroup">
                                      <input
                                      id="add-todo"
                                      type="text"
                                      className="form-control mb-1" 
                                      placeholder="Add Todo"
                                      onChange={(e) => setNewTodo(e.target.value.trim())}
                                      />
                                </div>
                                <div className="container">
                                    <div className="row pt-2">
                                        {  newTodo ?(
                                            <input type="submit" className="p-1 btn btn-primary" value="Add Todo" />
                                        ):(
                                            <input type="submit" className="p-1 btn btn-primary disabled" value="Add Todo"/>
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


export default AddTodo