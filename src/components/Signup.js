import React from 'react'
import { useState } from 'react';
import { useNavigate } from'react-router-dom'

const Signup = (props) => {
  const [credentials, setcredentials] = useState({name:"",email: "", password:"",cpassword:""});
  let history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(credentials.password!==credentials.cpassword){
      props.showAlert("Check your password again","danger")
      return
    }
    const response = await fetch("http://127.0.0.1:5000/api/auth/createUser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: credentials.email,email: credentials.email,password: credentials.password})
    });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      //save the auth token and redirect
      console.log(json.authtoken)
      console.log(1);
      localStorage.setItem('token', json.authToken);
      history('/')
      props.showAlert("Acount created successfully", "success")
    } else {
      props.showAlert("Invalid details", "danger")
    }

  }
  const onChange = (e) => {
    setcredentials({
      ...credentials, [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="name" onChange={onChange} value={credentials.name} aria-describedby="emailHel p" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" onChange={onChange} value={credentials.email} aria-describedby="emailHel p" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name="password" onChange={onChange} value={credentials.password} id="password" required minLength={5}/>
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name="cpassword" onChange={onChange} value={credentials.cpassword} id="cpassword" required minLength={5}/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

    </>
  )
}

export default Signup