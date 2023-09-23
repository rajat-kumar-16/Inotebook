import React from 'react'
import { useState } from 'react';
import { useNavigate } from'react-router-dom'

const Login = (props) => {
    const [credentials, setcredentials] = useState({email: "", password:""});
    let history = useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email,password: credentials.password})
          });
          const json= await response.json();
        //   console.log(json)
          if(json.success){
            //save the auth token and redirect
            // console.log(json)
            localStorage.setItem('token',json.authToken);
            // console.log('token')
            history('/')
            props.showAlert("Logged in successfully", "success")
          }else{
            props.showAlert("Invalid credential", "danger")
          }
    }
    const onChange = (e) => {
        setcredentials({
            ...credentials, [e.target.name]: e.target.value
        })
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onChange} value={credentials.email} name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} value={credentials.password} id="password" name='password'/>
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </>
    )
}

export default Login
