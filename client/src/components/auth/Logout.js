import {useContext, useEffect} from 'react'
import {  useHistory } from 'react-router-dom';
import UserContext from '../../context/userContext'

const Logout = () =>{
    const { setLoading } = useContext(UserContext);
    const history = useHistory();
    useEffect(()=>{
        const mountLogout = () =>{
            try{
                setLoading(true);
                localStorage.removeItem("auth-token");
                // setLoading(false);
                history.push('/')
                console.log("logout");
            }
            catch(err){
                console.log(err);
            }
        }
        mountLogout();
    })
    return null;
}

export default Logout;