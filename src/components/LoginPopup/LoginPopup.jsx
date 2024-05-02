import React, {  useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from 'axios';


const LoginPopup = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState("Login");
  const {url , setToken} = useContext(StoreContext)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e)=>{
    const name = e.target.name;
    const value = e.target.value;

    setData(data =>({...data, [name]:value }))
  }

  const onLogin = async (e)=>{

    e.preventDefault()

    let newUrl = url;
    if(currentState==="Login"){
        newUrl += "/api/user/login"
    }
    else{
        newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl , data);
    if(response.data.success){
        setToken(response.data.token)
        localStorage.setItem("token" , response.data.token);
        setShowLogin(false)
    }
    else{
        alert(response.data.message)
    }


  }

  
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-input">
          {currentState === "Sign Up" ? (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required />
          ) : (
            <></>
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
        </div>
        <button >
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By contuning , i agreed to the term of use & private policy. </p>
        </div>
        {currentState === "Login" ? (
          <p>
            Create an account ?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already Have an account ?{" "}
            <span onClick={() => setCurrentState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
