import { Cancel, Room } from '@material-ui/icons';
import axios from 'axios';
import { useRef, useState } from 'react';
import './register.css';

const Register = ({setShowRegister}) => {
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const name = useRef()
    const email = useRef()
    const password = useRef()
    const handelSubmit = async (e) =>{
        e.preventDefault()
        const newUser = {
            username :name.current.value,
            email :email.current.value,
            password :password.current.value
        }
        try {
             await axios.post('/users/register', newUser)
             setFail(false)
            setSuccess(true)
        } catch (error) {
            setSuccess(false)
            setFail(true)
        }
    }
    return (
        <div className='registerContainer' >
            <div className="logo">
                <Room/> PinCity
            </div>
            <form onSubmit={handelSubmit} >
                <input type='text' placeholder='username' ref={name} />
                <input type='email' placeholder='email' ref={email} />
                <input type='password' placeholder='password' ref={password} />
                <button className='reg' >Register</button>
                {
                    success && <span className='success' >Successfull. Feel free to login</span>
                }
                {
                    fail && <span className='fail' >wrong email pass or account alrady exist with this email</span>
                }
                
                
            </form>
            <Cancel className='regCancel' onClick={() => setShowRegister(false)} />
        </div>
    );
};

export default Register;