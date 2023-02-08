import React, { useState, useRef, useEffect } from "react"
import "./register.css"

//material ui
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useHistory } from "react-router";

//redux
import { useDispatch } from "react-redux";
import { registerFail, registerSuccess } from "../../redux/actions/authActions";
import { returnErrors } from "../../redux/actions/errorActions";

import axios from "axios"
import { axiosInstance } from "../../config";


/**
 * Matrail ui Components Styles
 */

const useStyles = makeStyles((theme) => ({
    buttonGuest: {
        fontFamily: "cursive",
        height: "50px",
        backgroundColor: "#00c9ff",
        top: "-37px",
        width: "65%",
        marginLeft: "auto",
        marginRight: "auto"
    },


}));


export default function Register() {
    const classes = useStyles();

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();
    const dispatch = useDispatch();


    /**
     * Notification
     */

    const notifyPassword = () => toast.error('Passwords dont match !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifySuccess = () => toast.success('Successfully registered !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });



    const handleClick = (e) => {
        passwordAgain.current.setCustomValidity('')

        console.log(password.current.value)
        console.log(passwordAgain.current.value)
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            notifyPassword();
        } else {

            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            };
            try {
                axiosInstance.post("/users/signup", user, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(resp => {
                        dispatch(registerSuccess(user))

                        console.log(resp.data);
                        history.push("/user/login");
                    }).then(resp => { notifySuccess() })

            } catch (err) {
                console.log(err);
                dispatch(returnErrors(err.response));
                dispatch(registerFail(user));

            }

        }
    }


    function loginPage() {
        history.push("/user/login");

    }



    return (

        <div className="register">
            <ToastContainer
                position="top-right"
                hideProgressBar={true}
                autoClose={false}
                newestOnTop={true}
                closeOnClick={false}
                draggable={false}
                rtl={false}
            />
            <div className="registerwrapper">
                <div className="registerleft">
                    <h3 className="registerlogotext">
                        Sharing
                    </h3>
                    <span className="registerlogoDesc"> Lets Discover the World</span>
                </div>
                <div className="registerright">

                    <form className="formregister" onSubmit={handleClick}>
                        <input required placeholder="Username" className="registerInput" ref={username} />
                        <input required placeholder="Email" type="email" className="registerInput" ref={email} />
                        <input required placeholder="Password" type="password" min="6" className="registerInput" ref={password} />
                        <input required placeholder="Password Again" type="password" className="registerInput" ref={passwordAgain} />
                        <Button variant="contained" color="secondary" style={{ height: "50px" }} type="submit">
                            Sign Up
                        </Button>
                        <Button color="secondary" onClick={() => loginPage()}>I have an Account</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
