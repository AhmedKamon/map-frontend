import { Cancel, Room } from '@material-ui/icons';
import axios from 'axios';
import { useRef, useState } from 'react';
import './login.css';

const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
    const [fail, setFail] = useState(false)
    const name = useRef()
    const password = useRef()
    const handelSubmit = async (e) =>{
        e.preventDefault()
        const user = {
            username :name.current.value,
            password :password.current.value
        }
        try {
            const res = await axios.post('/users/login', user)
             myStorage.setItem('user',res.data.username)
             setCurrentUser(res.data.username)
             setShowLogin(false)
             setFail(false)
        } catch (error) {
            setFail(true)
        }
    }
    return (
        <div className='LoginContainer' >
            <div className="logo">
                <Room/> PinCity
            </div>
            <form onSubmit={handelSubmit} >
                <input type='text' placeholder='username' ref={name} />
                <input type='password' placeholder='password' ref={password} />
                <button className='login' >Login</button>
                
                {
                    fail && <span className='fail' >wrong email pass or account alrady exist with this email</span>
                }
                
                
            </form>
            <Cancel className='loginCancel' onClick={() => setShowLogin(false)} />
        </div>
    );
};

export default Login;