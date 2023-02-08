import { React, useEffect, useState, Fragment } from "react";

//material ui
import {Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Skeleton from '@material-ui/lab/Skeleton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ReportIcon from '@material-ui/icons/Report';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useHistory } from "react-router-dom";

//redux
import { returnErrors } from "../../redux/actions/errorActions";

//sharing
import {
    FacebookShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import { SocialIcon } from 'react-social-icons';

import { format } from "timeago.js"

import axios from "axios"

//redux
import { useSelector } from "react-redux";
import { selectedPost } from "../../redux/actions/postActions";
import { useDispatch } from "react-redux";
import ViewPost from "../viewPost/ViewPost";
import { Popover } from "@mui/material";
import { axiosInstance } from "../../config";


/**
 * Matrail ui Styles
 */


const useStyles = makeStyles((theme) => ({

    container: {
        height: "47vh",
        textAlign: "-webkit-center",
        position: "sticky",
        top: 30,
        '@media (max-height: 950px)': {
            marginBottom: '150px'
        },
        '@media (max-height: 700px)': {
            marginBottom: '220px'
        },
        '@media (min-height: 950px)': {
            marginBottom: '150px'
        },



    },
    root: {
        maxWidth: 500,
        maxHeight: 600,


    },
    media: {
        '@media (min-height: 800px)': {
            maxHeight: 300,
            paddingTop: "56.25%", // 16:9
        },

        '@media (max-height: 800px)': {
            maxHeight: 200,
        },
    },
    expand: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    avatar: {
        backgroundColor: red[500],
    },
    comments: {
        display: "flex-end",
        marginLeft: "auto",
    },
    textContent: {
        maxHeight: 70,
        fontSize: "21px",
        fontWeight: "300",
        color: "black",

    },
    headerTitle: {
        fontSize: "27px",
        fontWeight: "inherit"
    },
    headerSubheader: {
        fontSize: "18px",
        fontWeight: "200",
        color: "black"
    },
    StyledSpeedDial: {
        position: 'absolute',
        '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
            bottom: theme.spacing(-2),
            right: theme.spacing(2),
        },
        '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
            top: theme.spacing(2),
            left: theme.spacing(2),
        },
    },
    Share:{
         backgroundColor: "transparent",boxShadow: "none",display:"flex",padding: "3px"
    }

}));


/**
 * Modal Styles
 */

const customStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const customStylesMobile = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '98%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};




export default function Post({ post, index, id }) {



    let history = useHistory();
    const classes = useStyles();
    const loggedUser = useSelector((state) => state.auth);
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [userImg, setUserImg] = useState("");
    const [likes, setLikes] = useState("")
    const [comments, setComments] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const dispatch = useDispatch();
    var path = require('path')

    /**
     * Sharing icons
     */
    const actions = [
        { icon: <FacebookShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="facebook" style={{ height: 30, width: 30 }} />  </FacebookShareButton>, name: 'Facebook' },
        { icon: <RedditShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="reddit" style={{ height: 30, width: 30 }} /> </RedditShareButton>, name: 'Reddit' },
        { icon: <TelegramShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="telegram" style={{ height: 30, width: 30 }} /> </TelegramShareButton>, name: 'Telegram' },
        { icon: <TwitterShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="twitter" style={{ height: 30, width: 30 }} /> </TwitterShareButton >, name: 'Twitter' },
        { icon: <WhatsappShareButton url={`http://localhost:3000/searchpage/exactShare/${post._id}`} > <SocialIcon network="whatsapp" style={{ height: 30, width: 30 }} /> </WhatsappShareButton>, name: 'Whatsapp' },
    ];


    /**
    * Notification
    */


    const notifySuccess = () => toast.success('Successfully deleted !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });



    const notifyLogin = () => toast.info('You have to Login first !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });






    useEffect(() => {

        const fetchUser = async () => {

            const firstResponse = await Promise.all([
                axiosInstance.get('/users/getuser/' + post.userId).then(res => {
                    setUser(res.data);
                    setUserImg(res.data.img);
                })
            ]);

            const secondResponse = await axiosInstance.get('/post/' + post._id)
                .then(res => {
                    setLikes(res.data.message?.likes.length)
                    setComments(res.data.message?.comments.length)
                    setIsLiked(res.data.message?.likes.includes(loggedUser.user));

                    setLoading(false);
                }
                )
        }
        if (post.userId) {
            fetchUser();
        }
    }, [loading])




    useEffect(() => {

        const fetchLikes = async () => {

            await axiosInstance.get('/post/' + post._id)
                .then(res => {
                    setLikes(res.data.message?.likes.length)
                    setComments(res.data.message?.comments.length)
                    setRefresh(false)
                }
                )
        }
        if (post.userId) {
            fetchLikes();
        }
    }, [refresh])




    /**
      * Checking screen width
      */


    const [screenWidth, setScreenWidth] = useState();

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleResize();

    });

    const handleResize = () => {
        setScreenWidth(window.outerWidth);

    }



    /**
      * Modal for each screen width
      */

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => {
        dispatch(selectedPost(post))
        setOpen(true)
    };
    const handleModalClose = () => setOpen(false);



    function modalopening() {
        if (screenWidth < 600) {
            return (



                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={customStylesMobile}>
                        <HighlightOffIcon fontSize='large' onClick={handleModalClose} style={{ float: "right", cursor: "pointer" }} />

                        <ViewPost />
                    </Box>
                </Modal>
            )

        } else {
            return (
                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={customStyles}>
                        <HighlightOffIcon fontSize='large' onClick={handleModalClose} style={{ float: "right", cursor: "pointer" }} />

                        <ViewPost />
                    </Box>
                </Modal>
            )
        }
    }







    const likeHandler = async () => {

        if (loggedUser.user == null) {
            return notifyLogin()
        }
        const usersend = { userId: loggedUser.user }

        const firstResponse = await Promise.all([
            axiosInstance.put("/post/" + post._id + "/like", usersend, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then(res => {
                    console.log(res)
                })
        ]);

        const secondResponse = await axiosInstance.get('/post/' + post._id)
            .then(res => {
                setLikes(res.data.message?.likes.length)
                setIsLiked(res.data.message?.likes.includes(loggedUser.user));
            }
            )

    }







    const deletePost = async (postId) => {

        if (loggedUser.user == null) {
            return notifyLogin()
        }

        const usersend = {
            userId: loggedUser.user,
            userPostId: post.userId
        }


        await axiosInstance.delete('/post/' + postId, usersend, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res)
            }).then(resp => {
                notifySuccess()
                setTimeout(function () {

                    history.go()
                }, 2500)
            })
            .catch(err => {
                console.log(err)
                dispatch(returnErrors(err.response));
            })


    }



    /**
     * Popup Card options
     * 
     */


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    function popup() {

        return (
            <Menu style={{ marginTop: "47px" }}
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >{
                    (loggedUser.user === post.userId) ? (
                        <MenuItem onClick={() => deletePost(post._id)}><DeleteOutlineIcon /> Delete</MenuItem>
                    ) : (
                        <MenuItem onClick={handleClose, notifyLogin}><ReportIcon /> Report</MenuItem>
                    )}
            </Menu>
        )
    }



    function userProfile(userId) {
        if (loggedUser.user == null) {
            return notifyLogin()
        }
        history.push(`/profile/` + userId);
    }


    /**
     * popup Share
     */


    const [anchorElShare, setAnchorElShare] = useState(null);

    const handleClickShare = (event) => {
        setAnchorElShare(event.currentTarget);
    };

    const handleCloseShare = () => {
        setAnchorElShare(null);
    };

    const openShare = Boolean(anchorElShare);
    const idShare = openShare ? 'simple-popover' : undefined;



    return (

        <div className={classes.divCards} key={index}>

            {modalopening()}
            <ToastContainer
                position="top-right"
                hideProgressBar={true}
                autoClose={false}
                newestOnTop={true}
                closeOnClick={false}
                draggable={false}
                rtl={false}
            />
            <Container className={classes.container}>
                <Card elevation={5} className={classes.root} >
                    {popup()}
                    <CardHeader

                        avatar={
                            loading ? (
                                <Skeleton animation="wave" variant="circle" width={40} height={40} />
                            ) : (
                                <Avatar
                                    src={userImg} onClick={() => userProfile(post.userId)} style={{ cursor: "pointer" }}
                                />
                            )
                        }

                        action={
                            (loading ? null : (
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVertIcon />
                                </IconButton>
                            ))
                        }
                        title={
                            loading ? (
                                <Skeleton animation="wave" style={{ marginRight: "33px" }} height={10} width="80%" style={{ marginRight: "20px", marginBottom: 6 }} />
                            ) : (
                                <Typography className={classes.comments} > {post.title} </Typography>

                            )
                        }
                        subheader={loading ? <Skeleton animation="wave" style={{ marginRight: "33px" }} height={10} width="40%" /> : user.username + " " + `(${format(post.createdAt)})`} />
                    <CardContent>
                        {loading ? (
                            ""
                        ) : (
                            <Typography className={classes.textContent} variant="body2" color="textSecondary" component="p" onClick={() => handleModalOpen(post)} style={{ cursor: "pointer" }}>
                                {post.description}
                            </Typography>)}
                    </CardContent>


                    {(['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].indexOf((path.extname(post.img)))) ? (

                        <div>
                            {loading ? (

                                <Skeleton variant="rect" width={500} height={250} />
                            ) : (
                                <CardMedia onClick={() => handleModalOpen(post)} style={{ height: "auto", width: "100%", paddingTop: "2%", cursor: "pointer" }}
                                    component='img'
                                    className={classes.media}
                                    src={post.img}
                                />)}
                        </div>



                    ) : (

                        <div>
                            <CardMedia style={{ height: "auto", width: "100%", paddingTop: "2%" }}
                                component='video'
                                className={classes.media}
                                src={post.img}
                                controls
                            />
                        </div>
                    )}


                    <CardActions disableSpacing>
                        {loading ? (
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        ) : (
                            <Fragment>
                                <IconButton aria-label="add to favorites" onClick={likeHandler}>
                                    {isLiked ? <ThumbUp style={{ color: "red" }} /> : <ThumbUp />}
                                </IconButton>

                                <Typography > {likes}</Typography>
                                <IconButton aria-label="add to favorites" onClick={() => handleModalOpen()}>
                                    {comments != 0 ? <QuestionAnswerIcon style={{ color: "red" }} /> : <QuestionAnswerIcon />}
                                </IconButton>
                                <Typography > {comments}</Typography>

                            </Fragment>

                        )
                        }
                        {loading ? (
                            <Skeleton animation="wave" variant="circle" width={40} height={40} style={{ display: "flex-end", marginLeft: "auto" }} />
                        ) : (
                            <div  >
                                <ShareIcon style={{ marginLeft: "10px", cursor: "pointer" }} onClick={handleClickShare} />

                                <Popover
                                    id={idShare}
                                    open={openShare}
                                    anchorEl={anchorElShare}
                                    onClose={handleCloseShare}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >   <div className={classes.Share}>
                                        {actions.map((action, index) => (
                                            <div key={index} style={{ cursor: "pointer" , padding:"10px" }}>
                                                {action.icon}
                                            </div>
                                        ))}
                                    </div>
                                </Popover></div>
                        )}

                    </CardActions>
                </Card>

            </Container>
        </div >
    )
}
