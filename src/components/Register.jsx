import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth, registerWithEmail } from '../auth/firebase';

function Register() {
const {email, setEmail } = useState("");
const {password, setPassword } = useState("");
const {name, setName } = useState("");
const {user, loading, error } = useState(auth);
const navigate = useNavigate();

const register = () => {
    if (!name) {
        alert("Please enter a name")    
    }
    registerWithEmail(name, email, password);
}

useEffect(() => {
    if (loading) return;
    if(user) navigate('/countries')
}, [user, loading, navigate])

    return (
        <div>
            <h1>Register</h1>

            <div>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder = "Full name"
                 />
                 <input 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder = "Email"
                 />
                 <input 
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder = "Password"
                 />
                <Button onClick={register}>Register</Button>
                Already have an account ?
                <Link to="/login">Login</Link> now.
            </div>
        </div>
    )
}

export default Register
