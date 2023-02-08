import React, { useRef, useEffect } from "react"
import "./reset.css"

//material ui
import Button from "@material-ui/core/Button";

import { useHistory } from "react-router";

import { toast } from 'react-toastify';

import axios from "axios"
import { axiosInstance } from "../../config";
//redux
import { useDispatch } from "react-redux";
import { authError, returnErrors } from "../../redux/actions/errorActions";



export default function Reset() {


    const email = useRef();
    const history = useHistory();
    const dispatch = useDispatch();


  /**
  * Notification
  */

    const notifysent = () => toast.success('Email sent, check in your mailbox !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifyError = () => toast.error('something went wrong, try again..', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });




  
    useEffect(() => {
        return history.listen((location) => {
            console.log(`You changed the page to: ${location.pathname}`)
        })
    }, [history])

    const handleClick = async (e) => {
        e.preventDefault();

        const user = {
            email: email.current.value,
        };

        axiosInstance.post("/users/reset-password", user)
            .then(res => {
                notifysent();
                history.push('user/login');
            })
            .catch((err) => {
                console.log(err);
                dispatch(authError(err));
                dispatch(returnErrors(err.response));
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
                        <Button variant="contained" color="secondary" style={{ height: "50px" }} type="submit">
                            Reset Password
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}
