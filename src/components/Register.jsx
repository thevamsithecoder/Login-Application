import React, { useState} from 'react'
import "../styles/AuthStyles.css";
import  toast  from "react-hot-toast"
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();

  //form function 
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/register", {name, username, password})
      if(res && res.data.success){ //res.data.success is accessing from backend
        toast.success(res.data && res.data.message)
        navigate("/login")
      } else {
        toast.error(res.data.message)
      }
    }
    catch(error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  }

  return (
      <div>
        <div className="form-container" style={{ minHeight: "90vh" }}>
          <form onSubmit={handleSubmit}>
            <h4 className="title">REGISTER FORM</h4>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                id="exampleInputName1"
                placeholder="Enter Your Name"
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                id="exampleInputUsername"
                placeholder="Enter Your Username"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter Your Password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              REGISTER
            </button>
          </form>
        </div>
      </div>
  )
}


export default Register 