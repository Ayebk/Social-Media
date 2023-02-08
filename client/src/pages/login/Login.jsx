import React, { useState, useRef, useEffect } from "react"
import "./login.css"

//material ui
import Button from "@material-ui/core/Button";

import { useHistory } from "react-router";

import { toast } from 'react-toastify';

//redux
import { useDispatch } from "react-redux";
import { loadingUser, loginSuccess } from "../../redux/actions/authActions";
import { authError, returnErrors } from "../../redux/actions/errorActions";


import axios from "axios"
import { axiosInstance } from "../../config";
export default function Login() {

    const email = useRef();
    const password = useRef();
    const history = useHistory();
    const dispatch = useDispatch();



      /**
      * Notification
      */

    const notifyError = () => toast.error('Some of the details, Wrong !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });




    function registerPage() {
        history.push("/user/register");
    }


    function resetPage() {
        history.push("/reset");
    }


    function ExplorePage() {
        history.push("/");
    }







    const handleClick = async (e) => {
        e.preventDefault();
        dispatch(loadingUser());

        const user = {
            email: email.current.value,
            password: password.current.value
        };

        axiosInstance.post("/users/login", user)
            .then(res => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", res.data.user._id)

                dispatch(loginSuccess(res.data.user));
                console.log(res.data.user)
                console.log(res.data)
                history.push('/');
                history.go();

            })

            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                dispatch(returnErrors(err.response));
                dispatch(authError());

                notifyError();
            });


    }

    return (
        <div className="login">
            <div className="loginwrapper">
                <div className="loginleft">
                    <h3 className="logotext">
                        Sharing
                    </h3>
                    <span className="logoDesc"> Lets Discover the World</span>
                </div>
                <div className="loginright">
                    <form className="formlogin" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" className="loginInput" ref={email} />
                        <input placeholder="Password" type="password" min="6" className="loginInput" ref={password} />
                        <Button variant="contained" color="secondary" style={{ height: "50px" }} type="submit">
                            Sign In
                        </Button>
                        <Button color="secondary" onClick={() => registerPage()}>I dont have an Account</Button>
                        <Button color="secondary" onClick={() => resetPage()}>Forgot Password?</Button>
                        <Button variant="outlined" style={{ height: "50px", color:"green" }} type="submit" onClick={() => ExplorePage()}>
                            Visit as Guest
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
