import React, { useEffect, useState } from "react";

//material ui
import { Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Home, People, Explore, AccountCircle } from "@material-ui/icons";
import { IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

//redux
import { useDispatch, useSelector } from "react-redux";
import { unexplore } from "../../redux/actions/exploreActions";
import { returnErrors } from "../../redux/actions/errorActions";

import { toast } from "react-toastify";

import { useHistory } from "react-router-dom";

import axios from "axios";

import Modal from 'react-modal';
import { axiosInstance } from "../../config";


/**
 * Matrail ui Styles
 */

const useStyles = makeStyles((theme) => ({
    container: {
        height: "90vh",
        paddingTop: theme.spacing(8),
        position: "sticky",
        top: 20,
        marginRight: "27px",
        padding: 0,
    },
    item: {
        display: "flex",
        paddingTop: theme.spacing(5),
        cursor: "pointer",
        marginLeft: "-30px",
        alignItems: "center",
        [theme.breakpoints.up("sm")]: {
            justifyContent: "flex-start",
        },
        [theme.breakpoints.down("1450")]: {
            justifyContent: "left",

        },
        [theme.breakpoints.down("md")]: {
            justifyContent: "center"
        },
    },
    icons: {
        [theme.breakpoints.down("1630")]: {
            marginLeft: "-25px",
        },
    },
    text: {
        marginLeft: theme.spacing(2),
        fontWeight: 500,
        [theme.breakpoints.down("1430")]: {
            display: "none",
        }
    },
    followingText: {
        [theme.breakpoints.down("1430")]: {
            display: "none",
        }
    },
    followingTitle: {
        marginTop: "25px",
        marginLeft: "-10px",
        textAlign: "center",
        marginBottom: "15px",

        [theme.breakpoints.down("1370")]: {
        }
    },
    following: {
        maxHeight: "750px",
        justifyContent: "left",
        paddingTop: theme.spacing(2),

        marginLeft: "-45px",
        alignItems: "center",
        [theme.breakpoints.down("1650")]: {
        },
        [theme.breakpoints.down("1280")]: {
            marginLeft: "-18px",
        },

    }, IconButton: {
        height: "60px", width: "150px",
        [theme.breakpoints.down("1430")]: {
            width: "65px"
        }
    },
    followersIcons: {
        WebkitTextStroke: "thin",
        [theme.breakpoints.down("1430")]: {
            left: "2px",
        }
    },
    buttonShow: {

        marginTop: "20px",
        marginLeft: "21px",
        [theme.breakpoints.down("1280")]: {
            marginLeft: "-4px",
        },
    }
}));


/**
 * Modal Styles
 */


const customStyles = {
    content: {
        height: '65%',
        width: '40%',
        top: '15%',
        left: '15%',

    },
};


Modal.setAppElement('#root');


export default function Leftbar() {

    const classes = useStyles();
    const loggedUser = useSelector((state) => state.auth);
    const [friends, setFriends] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    let history = useHistory();




    useEffect(() => {
        const getFriends = async () => {
            const usersend = { id: loggedUser.user }
            try {
                let payload = { id: loggedUser.user };
                await axiosInstance.get("/users/friends/" + loggedUser.user, payload).then(res => {
                    setFriends(res.data);
                })
            } catch (err) {
                console.log(err)
                dispatch(returnErrors(err.response));
            }
        }
        if (loggedUser.user == null) {
            return
        }
        getFriends();
    }, [loggedUser.user])



    /**
     * Notificattion
     */

    const notifyLogin = () => toast.info('You have to Login first !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });






    function backHome() {

        if (loggedUser.user == null) {
            return notifyLogin()
        }

        dispatch(unexplore());

        if (window.location.pathname === "/") {
            window.location.reload();
        }
        history.push("/");
        history.go();
    }



    const userProfile = (friend) => {

        if (loggedUser.user == null) {
            return notifyLogin()
        }

        history.push(`/profile/` + friend);
        history.go()
    }

    const toExplore = () => {


        history.push(`/category/all`);
        history.go()

    }


/**
 * Modal
 * 
 */


    function openModal() {
        if (loggedUser.user == null) {
            return notifyLogin()
        }
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);

    }





    return (
        <Container className={classes.container}>
            <div className={classes.item}>
                <IconButton className={classes.IconButton} color="inherit" style={{ borderRadius: "13px", justifyContent: "flex-start" }} onClick={() => backHome()} >
                    <Home className={classes.icon} style={{ fontSize: 40, color: "#c41616" }} ></Home>
                    <Typography className={classes.text} > Home </Typography>
                </IconButton>
            </div>

            <div className={classes.item}>
                <IconButton className={classes.IconButton} color="inherit" variant="text" style={{ borderRadius: "13px", justifyContent: "flex-start" }} onClick={() => toExplore()} >
                    <Explore className={classes.icon} style={{ fontSize: 40, color: "#0f0f9c" }} ></Explore>
                    <Typography className={classes.text}> Explore </Typography>
                </IconButton>
            </div>

            <div className={classes.item}>
                <IconButton className={classes.IconButton} color="inherit" style={{ borderRadius: "13px", justifyContent: "flex-start" }} onClick={() => openModal()}   >
                    <People className={classes.icon} style={{ fontSize: 40 }} ></People>
                    <Typography className={classes.text} > Friends </Typography>
                </IconButton>
            </div>


            <div className={classes.item}>
                <IconButton className={classes.IconButton} color="inherit" style={{ borderRadius: "13px", justifyContent: "flex-start" }} onClick={() => userProfile(loggedUser.user)} >
                    <AccountCircle className={classes.icon} style={{ fontSize: 40, color: "#18247a" }}  ></AccountCircle>
                    <Typography className={classes.text}> Profile </Typography>
                </IconButton>
            </div>

            <div >
                <div>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal">

                        <HighlightOffIcon fontSize='large' onClick={closeModal} style={{ float: "right", cursor: "pointer" }} />
                        <div>
                            <h2>Friends</h2>
                            {friends.map((friend, index) => (
                                <div key={index}>
                                    <ListItem className={classes.followersIcons}>
                                        <ListItemAvatar>
                                            <Avatar src={friend.img} onClick={() => { userProfile(friend._id) }} style={{ cursor: "pointer" }} />
                                        </ListItemAvatar>
                                        <ListItemText className={classes.followingText} primary={friend.username} secondary="" />
                                    </ListItem>
                                </div>
                            ))}

                        </div>

                    </Modal>
                </div>

                <List className={classes.following}>
                    {friends.length == 0 ? "" :
                        <div>
                            <hr style={{ width: "95%" }} />
                            <Typography className={classes.followingTitle} variant="h6"  >
                                Following:
                            </Typography>
                        </div>
                    }

                    {friends.slice(0, 4).map((friend, index) => (
                        <div key={index}>
                            <ListItem className={classes.followersIcons}>
                                <ListItemAvatar>
                                    <Avatar src={friend.img} onClick={() => { userProfile(friend._id) }} style={{ cursor: "pointer" }} />
                                </ListItemAvatar>
                                <ListItemText className={classes.followingText} primary={friend.username} secondary="" />
                            </ListItem>
                        </div>
                    ))}
                    {friends.length > 4 ? <div><Button className={classes.buttonShow} variant="outlined" onClick={() => openModal()}>Show more</Button>
                        <hr style={{ marginTop: "10px", marginRight: "31%", marginLeft: "18%", left: "10px" }} /></div> : ""}

                </List>

            </div>
        </Container>


    )
}
