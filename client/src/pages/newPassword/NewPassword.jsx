import React, { useRef } from "react"
import "./newPassword.css"

//material ui
import Button from "@material-ui/core/Button";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//redux
import { useDispatch } from "react-redux";
import {  registerSuccess } from "../../redux/actions/authActions";

import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

import axios from "axios"
import { axiosInstance } from "../../config";

export default function NewPassword() {
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();
    const dispatch = useDispatch();
    const {token} = useParams();
    console.log(token)
    

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

    const notifySuccess = () => toast.success('Successfully Changed Password !', {
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
                password: password.current.value,
                token: token 
            };
            try {
                axiosInstance.post("/users/new-password", user, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(resp => {
                        dispatch(registerSuccess(user))
                        console.log(resp.data);
                        history.push("/login");
                    }).then(resp => { notifySuccess()})

            } catch (err) {
                console.log(err);

            }
          
        }
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
                        <input required placeholder="Enter New Password" type="password" min="6" className="registerInput" ref={password} />
                        <input required placeholder="Enter New Password Again" type="password" className="registerInput" ref={passwordAgain} />
                        <Button variant="contained" color="secondary" style={{ height: "50px" }} type="submit">
                            Set New Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
